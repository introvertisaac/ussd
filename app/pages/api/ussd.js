const AfricasTalking = require('africastalking');

// Initialize the SDK
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICA_TALKING_API_KEY,
  username: process.env.AFRICA_TALKING_USERNAME,
});

// Create a USSD service
const ussdService = africastalking.UssdService();

const sendSMS = (phoneNumber, message) => {
  // Implement sending SMS using Africa's Talking SMS service
  const sms = africastalking.SMS;
  sms.send({
    to: [phoneNumber],
    message,
    from: 'YOUR_VIRTUAL_NUMBER', // Replace with your Africa's Talking virtual number
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
};

const ussdResponseHandler = (text) => {
  let response = '';

  if (text === '') {
    // Initial USSD menu
    response = 'Welcome to Emergency Support\n';
    response += '1. Emergency Services\n';
    response += '2. Health Tips Subscription\n';
    response += '3. Medication Refills\n';
    response += '4. Appointments\n';
  } else {
    switch (text) {
      case '1':
        // Emergency Services
        response = 'Emergency Services\n';
        response += '1. Call Emergency Number\n';
        response += '2. Request Emergency Services\n';
        break;
      case '1*1':
        // Call Emergency Number
        response = 'Calling emergency number 0757913538...';
        break;
      case '1*2':
        // Request Emergency Services
        response = 'Please provide your location to request emergency services.';
        break;
      case '2':
        // Health Tips Subscription
        response = 'Health Tips Subscription\n';
        response += '1. Maternal Health\n';
        response += '2. Nutrition\n';
        response += '3. Exercise\n';
        break;
      case '2*1':
        // Maternal Health
        response = 'Reply with your phone number to subscribe to Maternal Health tips.';
        break;
      case '2*1*?phoneNumber':
        // Subscribe to Maternal Health tips
        const phoneNumber = text.split('*')[2];
        response = `You have subscribed to Maternal Health tips. Tips will be sent to ${phoneNumber}.`;
        sendSMS(phoneNumber, 'Maternal Health Tip: Attend all prenatal appointments...');
        break;
      case '2*2':
        // Nutrition
        response = 'Reply with your phone number to subscribe to Nutrition tips.';
        break;
      case '2*3':
        // Exercise
        response = 'Reply with your phone number to subscribe to Exercise tips.';
        break;
      case '3':
        // Medication Refills
        response = 'Medication Refills\n';
        response += '1. Medication 1\n';
        response += '2. Medication 2\n';
        response += '3. Medication 3\n';
        response += '4. Medication 4\n';
        response += '5. Medication 5\n';
        break;
      case '3*1':
        // Medication 1 Refill
        response = 'Please select the hospital to refill Medication 1:\n';
        response += '1. Hospital A\n';
        response += '2. Hospital B\n';
        break;
      case '3*1*1':
        // Refill Medication 1 at Hospital A
        response = 'Your request for Medication 1 refill at Hospital A has been received. You will receive an SMS confirmation shortly.';
        sendSMS('+254700000000', 'Your request for Medication 1 refill at Hospital A has been received. Please visit the hospital to pick up your medication.');
        break;
      case '3*1*2':
        // Refill Medication 1 at Hospital B
        response = 'Your request for Medication 1 refill at Hospital B has been received. You will receive an SMS confirmation shortly.';
        sendSMS('+254700000000', 'Your request for Medication 1 refill at Hospital B has been received. Please visit the hospital to pick up your medication.');
        break;
      case '4':
        // Appointments
        response = 'Appointments\n';
        response += '1. Hospital A\n';
        response += '2. Hospital B\n';
        break;
      case '4*1':
        // Hospital A Appointments
        response = 'Select a department at Hospital A:\n';
        response += '1. Cardiology\n';
        response += '2. Pediatrics\n';
        break;
      case '4*1*1':
        // Cardiology Department at Hospital A
        response = 'Select a doctor for the Cardiology department at Hospital A:\n';
        response += '1. Dr. John Doe\n';
        response += '2. Dr. Jane Smith\n';
        break;
      case '4*1*1*1':
        // Dr. John Doe Appointment
        response = 'Please provide a preferred date for the appointment with Dr. John Doe (DD/MM/YYYY).';
        break;
      case '4*1*1*1*?date':
        // Confirm Appointment with Dr. John Doe
        const appointmentDate = text.split('*')[4];
        response = `Your appointment with Dr. John Doe at Hospital A (Cardiology) is confirmed for ${appointmentDate}. You will receive an SMS confirmation.`;
        sendSMS('+254700000000', `Your appointment with Dr. John Doe at Hospital A (Cardiology) is confirmed for ${appointmentDate}.`);
        break;
      default:
        response = 'Invalid option. Please try again.';
    }
  }

  return response;
};

export default async function handler(req, res) {
  const { text } = req.body;
  const ussdResponse = ussdResponseHandler(text);

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(ussdResponse);
}