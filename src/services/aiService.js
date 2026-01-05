import axios from 'axios';

// This URL must match your Java Controller (@RequestMapping + @PostMapping)
const API_URL = "http://localhost:8080/api/chat/ask"; 

export const sendMessageToAI = async (message) => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data;
  } catch (error) {
    console.error("Error talking to AI:", error);
    return "Server error. Try later.";
  }
};