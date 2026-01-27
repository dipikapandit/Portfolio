// Basic mailto fallback: opens the user's mail client with prefilled subject/body.
// IMPORTANT: Replace the email below with your real email address.
		

const RECEIVER_EMAIL = 'dipikadidiworks@gmail.com';

// Cache DOM elements to avoid repeated queries
let formElements = null;

function getFormElements() {
	if (!formElements) {
		formElements = {
			name: document.getElementById('name'),
			email: document.getElementById('email'),
			message: document.getElementById('message'),
			form: document.getElementById('contactForm'),
			success: document.getElementById('successMsg')
		};
	}
	return formElements;
}

function handleContact(event) {
	event.preventDefault();
	const elements = getFormElements();
	
	const name = elements.name.value.trim();
	const email = elements.email.value.trim();
	const message = elements.message.value.trim();

	if (!name || !email || !message) return;

	const subject = encodeURIComponent(`Portfolio contact from ${name}`);
	const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

	// Open the user's default mail client
	window.location.href = `mailto:${RECEIVER_EMAIL}?subject=${subject}&body=${body}`;

	// Show a brief success hint (user still needs to send the email in their mail client)
	elements.success.style.display = 'inline-block';
	setTimeout(() => { elements.success.style.display = 'none'; }, 6000);

	elements.form.reset();
}