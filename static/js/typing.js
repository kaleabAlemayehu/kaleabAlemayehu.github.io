// Matrix typing animation for about page
// Types content line by line with cursor block and random delays

(function() {
  const typingSpeed = 25;
  const container = document.getElementById('typing-text');
  
  if (!container) return;
  
  const content = container.getAttribute('data-content');
  if (!content) return;
  
  const lines = content.split('\n');
  let lineIndex = 0;
  let charIndex = 0;
  
  function typeLine() {
    if (lineIndex < lines.length) {
      const currentLine = lines[lineIndex];
      
      if (charIndex < currentLine.length) {
        container.innerHTML += currentLine[charIndex];
        charIndex++;
        setTimeout(typeLine, typingSpeed + (Math.random() * 20));
      } else {
        container.innerHTML += '\n';
        lineIndex++;
        charIndex = 0;
        setTimeout(typeLine, 150);
      }
      
      const terminalBody = container.closest('.terminal-body');
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    } else {
      // Typing complete - show input line
      const inputLine = document.getElementById('command-input');
      if (inputLine) {
        inputLine.classList.remove('hidden');
      }
    }
  }
  
  // Start typing when page loads
  window.addEventListener('load', function() {
    setTimeout(typeLine, 1000);
  });
})();
