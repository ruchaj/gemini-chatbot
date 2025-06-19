// This function creates an event listener for submitting and clearing messages that are active when the chatbot loads
document.addEventListener("DOMContentLoaded",function(){
    // Assigns the two buttons, submit and clear, to a variable
    const submitBtn = document.getElementById("submit-btn");  
    const clearBtn = document.getElementById("clearchat-btn");
    
    // Calls sendMessage if "submit" is pressed
    submitBtn.addEventListener("click",sendMessage);

    // Calls sendMessage if user presses "enter" as an alternative to the submit button
    document.addEventListener("keypress",(e)=>{
        if(e.key==="Enter"){
            sendMessage();
        }
    });

    // Clears all chat history when submit button is clicked
    clearBtn.addEventListener("click",function(){
        document.getElementById("messages").innerHTML = "";
    });
});

// This function creates a variable to hold the user-input, calls the function to add it to the message body and clears the prompt box, and calls for the AI response
function sendMessage(){

    // stores userInput 
    const userInput = document.getElementById("user-input").value.trim();

    if (userInput){
        // Adds the message to the message body above the prompt box
        appendMessage("user",userInput);

        //clears the prompt box
        document.getElementById("user-input").value = "";

        // Calls the function which calls the AI API
        getAIReponse(userInput);
    }
}

// Gets the message and the sender type, then appends the message to the appropriate side of the message box
function appendMessage(sender,message){

    //gets the messageContainer and creates a div for the individual element
    const messageContainer = document.getElementById("messages");
    const messageElement = document.createElement("div");

    // Adds the message to the messageElement, with the user type noted for the side styling
    messageElement.classList.add("message");
    messageElement.classList.add(sender === "user" ? "user-message" : "ai-message");

    // Includes the message in the messageElement and adds it to the history
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    // Adds it to the top of the body
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Calls the Google Gemini API, sending the message, and calls the function to append the repsonse
async function getAIReponse(userMessage) {

    // Insert Gemini API key here.
    const API_KEY = "";

    // URL for the API - uses above API key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        // Sends a post request to the Gemini API with the User's message
        const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
            {
                parts: [{ text: userMessage }],
            },
            ],
        }),
        });

        // Assigns response to a data variable
        const data = await response.json();

        // Throws an error if there is no connection from the API
        if (!data.candidates || !data.candidates.length) {
            throw new Error("No response from Gemini API");
        }

        // Checks if a message was returned, otherwise returns "No Response"
        const botMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

        // Appends message to chat history
        appendMessage("bot", botMessage);
    } catch (error) {
        // Logs any other errors and asks user to try again
        console.error("Error:", error);
        appendMessage(
            "bot",
            "Sorry, I'm having trouble responding. Please try again."
        );
    }



}