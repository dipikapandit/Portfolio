let scores = JSON.parse(localStorage.getItem('scores')) || {
        wins: 0,
        losses: 0,
        ties: 0
      };

      let isAutoPlaying = false;
      let intervalId;
      let saveTimeout;

      // Cache DOM elements to avoid repeated queries
      const domCache = {
        result: null,
        moves: null,
        score: null,
        autoplayButton: null
      };

      function getDomElement(key, selector) {
        if (!domCache[key]) {
          domCache[key] = document.querySelector(selector);
        }
        return domCache[key];
      }

      // Debounced localStorage save to batch writes and reduce blocking
      function saveScores() {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(() => {
          localStorage.setItem('scores', JSON.stringify(scores));
        }, 300); // Batch writes within 300ms window
      }

      function autoplay() {
        if (!isAutoPlaying) {
          intervalId = setInterval(function() {
          const playerMove = pickCompMove();
          playGame(playerMove);
        }, 1000);
        isAutoPlaying = true;
        } else {
          clearInterval(intervalId);
          isAutoPlaying = false;
        }

        updateAutoplayButton();
      }

      function updateAutoplayButton() {
        const autoplayButton = getDomElement('autoplayButton', '.autoplay-button');

        if (!autoplayButton) {
          return;
        }

        autoplayButton.classList.toggle('is-active', isAutoPlaying);
      }

      function playGame(playerMove) {
        const computerMove = pickCompMove();

        if (playerMove === 'Rock') {
          if (computerMove === 'Rock') {
            result = 'Tie';
          } else if (computerMove ==='Paper') {
            result = 'You Lost';
          } else {
            result = 'You Won';
          } 
        } else if (playerMove === 'Paper') {
          if (computerMove === 'Rock') {
            result = 'You Won';
          } else if (computerMove ==='Paper') {
            result = 'Tie';
          } else {
            result = 'You Lost';
          }
        } else {
            if (computerMove === 'Rock') {
              result = 'You Lost';
            } else if (computerMove ==='Paper') {
              result = 'You Won';
            } else {
              result = 'Tie';
            }
        }

        if (result === 'You Won') {
          scores.wins++ ;
        } else if (result === 'You Lost') {
          scores.losses++ ;
        } else if (result === 'Tie') {
          scores.ties++ ;
        }

        saveScores();

        updateScoreElement();

        getDomElement('result', '.js-result').innerHTML = result;

        getDomElement('moves', '.js-moves').innerHTML = `You
      <img src="images/${playerMove.toLowerCase()}.png">
      <img src="images/${computerMove.toLowerCase()}.png">
      Computer`;
      }

      function updateScoreElement() {
         getDomElement('score', '.js-score')
            .innerHTML = `Wins: ${scores.wins} Loses: ${scores.losses} Ties: ${scores.ties}`;
      }

      function pickCompMove() {
        const ranNum = Math.random();
        let computerMove = '';

        if (ranNum>= 0 && ranNum < 1/3) {
          computerMove = 'Rock';
        } else if (ranNum >= 1/3 && ranNum < 2/3) {
          computerMove = 'Paper';
        } else {
          computerMove = 'Scissors';
        }          
        return computerMove;      
      }

      updateAutoplayButton();