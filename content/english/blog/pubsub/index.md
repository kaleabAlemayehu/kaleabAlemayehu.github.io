---
title: "Pub/Sub Concurrency Pattern"
meta_title: "Pub/Sub Concurrency Pattern"
description: "Publisher / Subscriber Concurrency pattern"
date: 2025-04-04T05:00:00Z
image: "pubsub.png"
categories: ["Pattern", "Event"]
author: "Kaleab Alemayehu ( Neo )"
tags: ["Golang", "channels", "pub/sub", "concurrency pattern", "event"]
draft: false 
---

## Story time
I was trying to develop werewolf telegram bot, where i have 3 components the game, gameManager, and notifier. as you may have guess already there resposiblity is:
  - gameManager: the manager of all the games it spawn new games clean finished one and store the stats and states on the repository layer.
  - game: the spawned Game instance that gonna be managed by gameManager, and it is a state machine that track and react to game states occur during the game loop and gonna send game events to the notifier, and gameManager.
  - notifier: is the one that listen events from the game instance and send to the telegram group or user about game phase and events occur.

NB: if you say why not just call a function of outter layers from the game instance ( which is the inner one), it would create circular dependancy as the outter layer always depend on the inner one.

{{< figure src="eventdiagram.png" alt="Event Diagram" class="centerdImage" >}}

i prefer not using one channel per listener and giving that channel to the game instance. that create a lot of dependency as the game instance has to have all the channels created by the listeners and that leads to very ugly code, rendendent event sending logic and it is not scaleable. for our case it is just two channels one for Game Manager and one for notifier but, what if i want to add other client other than Telegram bot, maybe porting it to web client i made. it would become very ugly and poor implimentation. so the only way is to create **broadcaster** that gonna listen from one source ( in our case the game instance ) and send it to the listeners (Game manager and notifer for now).

{{< figure src="eventBroker.png" alt="Event Broker" class="centerdImage" >}}

and that is where Pub/Sub Pattern comes into play.

## Naive Pub/Sub

```go {linenos=inline}
package event

import (
	"sync"
	"github.com/kaleabAlemayehu/werewolf/internal/domain"
)

type EventBroker struct {
	subscribers []chan domain.GameEvent
	mutex       sync.RWMutex
	isClosed    bool
}

func NewEventBroker() *EventBroker {
	return &EventBroker{}
}

func (b *EventBroker) Subscribe() chan domain.GameEvent {
	b.mutex.Lock()
	defer b.mutex.Unlock()
	if b.isClosed {
		return nil
	}
	ch := make(chan domain.GameEvent, 10)
	b.subscribers = append(b.subscribers, ch)
	return ch
}

func (b *EventBroker) Unsubscribe(channel chan domain.GameEvent) {
	b.mutex.Lock()
	defer b.mutex.Unlock()
	if b.isClosed {
		return nil
	}
	for i, ch := range b.subscribers {
		if ch == channel {
			b.subscribers = append(b.subscribers[:i], b.subscribers[i+1:]...)
			close(ch)
			break
		}
	}
	return
}

func (b *EventBroker) Publish(event domain.GameEvent) {
	b.mutex.RLock()
	defer b.mutex.Unlock()
	if b.isClosed {
		return
	}
	for _, ch := range b.subscribers {
		ch <- event
	}
}

func (b *EventBroker) Close() {
	b.mutex.Lock()
	defer b.mutex.Unlock()
	if b.isClosed {
		return
	}
	for _, ch := range b.subscribers {
		close(ch)
	}
}

```

I'm not gonna provide how i use it on notifer and Game Manager Components as it is unnecessary and lead to bloated blog but you could use it like this.
```go {linenos=inline}
package main
import (
  "log"
  "sync"
  "github.com/kaleabAlemayehu/werewolf/internal/events"
  "github.com/kaleabAlemayehu/werewolf/internal/domain"
)

func main(){
  broker :=event.NewEventBroker()
  ch := broker.Subscribe()
  var wg sync.WaitGroup
  wg.Add(1)
  go func(){
    defer wg.Done()
    for event := range ch {
      log.Printf("event occur: %v", event)
    }
  }()
  // publish a couple of times
  for i := range 5 {
    broker.Publish(domain.GameEvent{
      // here event data 
    })
  } 
  // close the broker or the listener loop continue forever and with wg.Wait() on the bottom you will have deadlock
  broker.Close()
  wg.Wait()
}

```

you may have find similar implimentation from one of my favorite golang youtuber [mario's video](https://youtu.be/s-I3Bs3ZUsY?si=y8RX8SfsbLOjE1o4), and he said this is code is just for demostration purpose only to show how pub/sub works and you may also notice a couple of defect it.

 - **the publish method is blocking.** what if one listener is down and stop listening from the channel it subscribe, it will lead to dead lock, it may endure until the buffer is full but it will not last long. when the buffer is full dead lock will happen, as there is lock on the top of the function body. that lock will not be unlocked until the loop is over. the loop got stuck that lead to dead lock of The EventBroker.

 - **storing the subscribers in array instead of hashmap** so that the Unsubscribe function have time complexity of n instead of 1. where n is the number of subscribers.

## Let's Address The shortcomings

Let's address the shortcomings of the above implimentation one by one 

### The Publish Method

the problem with the publish method is it is blocking if one subscriber stop listening for the event. to solve this what if we create new goroutine when we try to publish an event that would be prevent blocking of other event publishings right? so we can do it like this

```go {linenos=inline}
func (b *EventBroker) Publish(event domain.GameEvent) {
	b.mutex.RLock()
	defer b.mutex.Unlock()
	if b.isClosed {
		return
	}
	for _, ch := range b.subscribers {
		go func(c chan domain.GameEvent) {
			c <- event:
		}(ch)
	}
}
```
This may look like a decent solution since it prevents blocking other events when a subscriber blocks. But there’s a catch: those blocked goroutines are a time bomb, they never terminate unless the program exits, leading to goroutine leaks. Imagine if there are n failed subscribers and m events occur during the game: that would create n × m goroutines stuck forever.

### Who are you talking to?

How can we solve the goroutine leaks?

The Solution is simple just like The Great Rob Pike said in this [talk](https://youtu.be/f6kdp27TYZs?si=TwM_bOGgTbmuNeKz) golang's concurrency inspired by real world things, what would you do when someone stop listening to you, you stop talking to them right? so we will drop event that don't have listener.

```go {linenos=inline}
func (b *EventBroker) Publish(event domain.GameEvent) {
	b.mutex.RLock()
	defer b.mutex.Unlock()
	if b.isClosed {
		return
	}
	for _, ch := range b.subscribers {
		go func(c chan domain.GameEvent) {
			select {
			case c <- event:
			default:
				// drop the event 
			}
		}(ch)
	}
}
```

yet there is another defect imagine creating and deleteing **n** goroutine for every event that occur where n is the number of subscribers. it will lead to **goroutine churn** where the runtime gonna stress more about creating and deleting short lived goroutines then actualy doing useful jobs.

### Goroutine Churn 

so what is the solution? the solution for goroutine churn is to use existing one instead of creating everytime for short lived tasks infact we gonna create one go routine that will live with the lifetime of the Eventbroker that gonna send events to the subscribers and the publishers task would be to forward the event to that go routine. and that comes with restrcutring the EventBroker struct,as we need channel that we gonna use to listen events from the publisher and send it to the subscribers, and also i am gonna address the previous data structure issue, we gonna store the subscribers in hashmap as we go.


```go {linenos=inline}

type EventBroker struct {
	subscribers map[chan domain.GameEvent]struct{}
	mutex       sync.RWMutex
	events      chan domain.GameEvent
}

func NewEventBroker() *EventBroker {
	broker := &EventBroker{
		subscribers: make(map[chan domain.GameEvent]struct{}, 2),
		events:      make(chan domain.GameEvent, 20),
	}
	go broker.run()
	return broker
}

func (b *EventBroker) run() {
	for {
		select {
		case event := <-b.events:
			b.mutex.RLock()
			for ch := range b.subscribers {
				select {
				case ch <- event:
				default:
					// dropping it  
				}
			}
			b.mutex.RUnlock()
	}
}

func (b *EventBroker) Publish(event domain.GameEvent){
	b.mutex.RLock()
	defer b.mutex.RUnlock()
	b.events <- event
}

```

this look good right? yeah, I know this is a lot of defects to digest but just a little bit of tweaking we need to destroy the goroutine that listen for the events and send to subscribers when the EventBroker get closed so how do goroutines communicate with each other? by channels right? we use a signal channel to indicate when the EventBroker is closed. so our new code looks like this.

```go {linenos=inline}

type EventBroker struct {
	subscribers map[chan domain.GameEvent]struct{}
	mutex       sync.RWMutex
	events      chan domain.GameEvent
  // done channel that gonna be use for signal for destroying the channel
	done        chan struct{}
}

func NewEventBroker() *EventBroker {
	broker := &EventBroker{
		subscribers: make(map[chan domain.GameEvent]struct{}, 2),
		events:      make(chan domain.GameEvent, 20),
		done:        make(chan struct{}),
	}
	go broker.run()
	return broker
}

func (b *EventBroker) run() {
	for {
		select {
		case event := <-b.events:
			b.mutex.RLock()
			for ch := range b.subscribers {
				select {
				case ch <- event:
				default:
					// drop the event 
				}
			}
			b.mutex.RUnlock()
		case <-b.done:
			return
		}
	}
}

func (b *EventBroker) Close() {
	close(b.done)
	b.mutex.Lock()
	defer b.mutex.Unlock()
	for ch := range b.subscribers {
		close(ch)
	}
	close(b.events)
}

```

### Polishing it off 

after i add some custom errors, integrating the new done channel and using the new datastructure ( hashmap ), and preventing closing the same channels more than once by using `sync.Once` ( btw it will lead to panic if you close already closed channel ) on our EventBroker methods. it looks like this


```go {linenos=inline}
package events

import (
	"errors"
	"sync"

	"github.com/kaleabAlemayehu/werewolf/internal/domain"
)

var (
	ErrBrokerClosed   = errors.New("Event broker is blocked")
	ErrUnknownChannel = errors.New("Unknown channel")
)

type EventBroker struct {
	subscribers map[chan domain.GameEvent]struct{}
	mutex       sync.RWMutex
	events      chan domain.GameEvent
	done        chan struct{}
  // prevents double closing of the channel
	closeOnce   sync.Once
}

func NewEventBroker() *EventBroker {
	broker := &EventBroker{
		subscribers: make(map[chan domain.GameEvent]struct{}, 2),
		events:      make(chan domain.GameEvent, 20),
		done:        make(chan struct{}),
	}
	go broker.run()
	return broker
}

func (b *EventBroker) run() {
	for {
		select {
		case event := <-b.events:
			b.mutex.RLock()
			for ch := range b.subscribers {
				select {
				case ch <- event:
				default:
					// drop the evenet 
				}
			}
			b.mutex.RUnlock()
		case <-b.done:
			return
		}
	}
}

func (b *EventBroker) Subscribe() (chan domain.GameEvent, error) {
	b.mutex.Lock()
	defer b.mutex.Unlock()
	select {
	case <-b.done:
		return nil, ErrBrokerClosed
	default:

	}
	ch := make(chan domain.GameEvent, 10)
	b.subscribers[ch] = struct{}{}
	return ch, nil
}

func (b *EventBroker) Publish(event domain.GameEvent) error {
	b.mutex.RLock()
	defer b.mutex.RUnlock()
	select {
	case <-b.done:
		return ErrBrokerClosed
	default:
		b.events <- event
		return nil
	}
}

func (b *EventBroker) Unsubscribe(ch chan domain.GameEvent) error {
	b.mutex.Lock()
	defer b.mutex.Unlock()
	if _, ok := b.subscribers[ch]; ok {
		delete(b.subscribers, ch)
		close(ch)
		return nil
	}
	return ErrUnknownChannel
}

func (b *EventBroker) Close() {
	b.closeOnce.Do(func() {
		close(b.done)
		b.mutex.Lock()
		defer b.mutex.Unlock()
		for ch := range b.subscribers {
			close(ch)
		}
		close(b.events)
	})

}

```

## Conclusion 

Here we are at the end of my blog on the publisher/subscriber concurrency pattern, where I walked through how I built the event broker I use for my Werewolf Telegram bot. If you have any suggestions or better ways of doing things, I’d love to hear from you, I’m always open to learning, as Helmut Schmidt said, 'The largest room in the world is the room for improvement.' Since this is my first blog, I want to sincerely thank you for reading. See you in the next one!
