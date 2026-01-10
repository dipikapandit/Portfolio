// Basic mailto fallback: opens the user's mail client with prefilled subject/body.
// IMPORTANT: Replace the email below with your real email address.
		

const RECEIVER_EMAIL = 'dipikadidiworks@gmail.com';

		function handleContact(event) {
			event.preventDefault();
			const name = document.getElementById('name').value.trim();
			const email = document.getElementById('email').value.trim();
			const message = document.getElementById('message').value.trim();

			if (!name || !email || !message) return;

			const subject = encodeURIComponent(`Portfolio contact from ${name}`);
			const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

			// Open the user's default mail client
			window.location.href = `mailto:${RECEIVER_EMAIL}?subject=${subject}&body=${body}`;

			// Show a brief success hint (user still needs to send the email in their mail client)
			const success = document.getElementById('successMsg');
			success.style.display = 'inline-block';
			setTimeout(() => { success.style.display = 'none'; }, 6000);

			document.getElementById('contactForm').reset();
		}