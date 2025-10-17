import OpenAI from "openai";
import { pdfImageExtractor } from "./pdf-image-extractor";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});


// Function to generate contextual Unsplash image URL for restaurant content
function generateUnsplashImage(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // High-quality Indian food images for different categories - sized to match specification
  const imageCategories = {
    appetizers: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=235&h=157&fit=crop&crop=center", // Indian samosas
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=235&h=157&fit=crop&crop=center", // Indian chaat
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=235&h=157&fit=crop&crop=center"  // Indian pakoras
    ],
    mains: [
      "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=235&h=157&fit=crop&crop=center", // Indian biryani
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=235&h=157&fit=crop&crop=center", // Indian curry
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=235&h=157&fit=crop&crop=center"  // Indian dal
    ],
    desserts: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=235&h=157&fit=crop&crop=center", // Indian sweets
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=235&h=157&fit=crop&crop=center", // Gulab jamun
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=235&h=157&fit=crop&crop=center"  // Indian kulfi
    ],
    beverages: [
      "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=235&h=157&fit=crop&crop=center", // Mango lassi
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=235&h=157&fit=crop&crop=center", // Masala chai
      "https://images.unsplash.com/photo-1594736797933-d0dc1508d655?w=235&h=157&fit=crop&crop=center"  // Indian drinks
    ],
    tandoor: [
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=235&h=157&fit=crop&crop=center", // Tandoori chicken
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=235&h=157&fit=crop&crop=center", // Naan bread
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=235&h=157&fit=crop&crop=center"  // Tandoori dishes
    ],
    biryani: [
      "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=235&h=157&fit=crop&crop=center", // Chicken biryani
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=235&h=157&fit=crop&crop=center", // Vegetable biryani
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=235&h=157&fit=crop&crop=center"  // Mutton biryani
    ],
    restaurant: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=235&h=157&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=235&h=157&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=235&h=157&fit=crop&crop=center"
    ]
  };
  
  let category = "restaurant";
  
  if (message.includes("appetizer") || message.includes("starter") || message.includes("chaat") || message.includes("samosa") || message.includes("pakora")) {
    category = "appetizers";
  } else if (message.includes("biryani") || message.includes("bharwan") || message.includes("paneer tikka") || message.includes("kathal")) {
    category = "biryani";
  } else if (message.includes("tandoor") || message.includes("naan") || message.includes("roti") || message.includes("kebab")) {
    category = "tandoor";
  } else if (message.includes("main") || message.includes("curry") || message.includes("dal") || message.includes("chicken") || message.includes("mutton")) {
    category = "mains";
  } else if (message.includes("dessert") || message.includes("sweet") || message.includes("gulab") || message.includes("kulfi") || message.includes("kheer")) {
    category = "desserts";
  } else if (message.includes("drink") || message.includes("beverage") || message.includes("lassi") || message.includes("chai") || message.includes("juice")) {
    category = "beverages";
  }
  
  // Select a random image from the category
  const images = imageCategories[category as keyof typeof imageCategories] || imageCategories.restaurant;
  const randomIndex = Math.floor(Math.random() * images.length);
  
  return images[randomIndex];
}

const COMPANY_CONTEXT = `
You are an AI culinary assistant for India Palace Restaurant, specializing in authentic Indian cuisine. You provide mouth-watering, conversational responses in HTML format with rich multimedia content about our exquisite dishes and culinary experiences.

=== RESTAURANT INFORMATION ===
Restaurant Name: India Palace Restaurant
Established: 2015
Cuisine Type: Authentic Indian & Indo-Chinese Fusion
Dining Style: Traditional Indian hospitality with modern presentation
Ambiance: Warm, welcoming atmosphere with traditional Indian decor and contemporary comfort

=== LOCATION & CONTACT ===
Main Branch: 123 Main Street, Downtown District
Chinese Fusion Branch: 456 East Avenue, Chinatown District  
Continental Branch: 789 West Boulevard, Uptown District
Phone: (555) 123-4567
Email: info@indiapalace.com
Website: www.indiapalace.com

=== OPERATING HOURS ===
Monday - Thursday: 11:00 AM - 10:00 PM
Friday - Saturday: 11:00 AM - 11:00 PM
Sunday: 12:00 PM - 9:00 PM
All branches open 7 days a week

=== RESTAURANT FEATURES ===
- Free delivery within 5 miles
- Reservations recommended for weekends
- Private dining available
- Catering services for events
- Takeout and online ordering
- Wheelchair accessible
- Parking available
- WiFi for customers

=== CHEF & CULINARY TEAM ===
Head Chef: Rajesh Kumar (15+ years experience in traditional Indian cuisine)
Specialty: Authentic North Indian and Mughlai dishes
Cooking Philosophy: Traditional recipes passed down through generations, using authentic spices imported from India
Signature Techniques: Dum cooking, tandoor grilling, slow-simmered curries

=== DETAILED MENU WITH PRICES ===

APPETIZERS & STARTERS:
- Vegetable Samosas (2 pieces) - $4.99: Crispy pastry filled with spiced potatoes and peas
- Chicken Pakoras - $6.99: Tender chicken pieces marinated in gram flour and spices, deep-fried
- Paneer Tikka - $7.99: Grilled cottage cheese cubes marinated in yogurt and spices
- Tandoori Chicken Wings - $8.99: Spicy chicken wings cooked in traditional tandoor
- Aloo Tikki - $5.99: Spiced potato patties served with chutneys
- Chaat Platter - $9.99: Assorted Indian street food snacks

BIRYANI SPECIALTIES:
- Chicken Biryani - $16.99: Fragrant basmati rice with tender chicken, saffron, and aromatic spices
- Mutton Biryani - $18.99: Traditional biryani with succulent mutton pieces
- Vegetable Biryani - $14.99: Mixed vegetables with basmati rice and spices
- Paneer Biryani - $15.99: Cottage cheese biryani with aromatic rice
- Prawn Biryani - $19.99: Fresh prawns with fragrant basmati rice
- Special Royal Biryani - $22.99: Combination of chicken, mutton, and prawns

CURRIES & GRAVIES:
- Butter Chicken - $15.99: Tender chicken in creamy tomato-based sauce
- Chicken Tikka Masala - $16.99: Grilled chicken in rich, spiced tomato cream sauce
- Palak Paneer - $13.99: Cottage cheese in creamy spinach gravy
- Dal Makhani - $12.99: Slow-cooked black lentils with cream and butter
- Rogan Josh - $17.99: Aromatic lamb curry with Kashmiri spices
- Chana Masala - $11.99: Spiced chickpea curry
- Malai Kofta - $14.99: Vegetable dumplings in creamy tomato sauce

TANDOOR SPECIALTIES:
- Tandoori Chicken (Half) - $12.99: Marinated chicken cooked in clay oven
- Tandoori Chicken (Full) - $19.99: Complete chicken marinated and grilled
- Seekh Kebab - $13.99: Spiced minced meat grilled on skewers
- Tandoori Fish - $16.99: Fresh fish marinated and grilled in tandoor
- Tandoori Prawns - $18.99: Large prawns marinated and grilled
- Mixed Tandoori Platter - $24.99: Assorted tandoori items for sharing

BREADS & RICE:
- Plain Naan - $2.99: Traditional leavened bread
- Garlic Naan - $3.99: Naan topped with garlic and herbs
- Butter Naan - $3.49: Naan brushed with butter
- Peshawari Naan - $4.99: Stuffed with nuts and raisins
- Roti - $2.49: Whole wheat flatbread
- Jeera Rice - $3.99: Basmati rice with cumin seeds
- Plain Rice - $2.99: Steamed basmati rice

DESSERTS:
- Gulab Jamun (2 pieces) - $4.99: Milk dumplings in rose-flavored syrup
- Ras Malai - $5.99: Cottage cheese dumplings in sweetened milk
- Kulfi - $3.99: Traditional Indian ice cream
- Kheer - $4.99: Rice pudding with nuts and saffron
- Gajar Halwa - $5.99: Carrot pudding with nuts
- Mango Lassi - $4.99: Sweet yogurt drink with mango

BEVERAGES:
- Mango Lassi - $4.99: Sweet yogurt drink with fresh mango
- Sweet Lassi - $3.99: Traditional sweet yogurt drink
- Salted Lassi - $3.99: Refreshing salted yogurt drink
- Masala Chai - $2.99: Spiced Indian tea
- Fresh Lime Soda - $2.99: Refreshing lime drink
- Mango Juice - $3.99: Fresh mango juice
- Thums Up - $2.49: Indian cola drink

=== SPECIAL DIETARY OPTIONS ===
- Vegetarian: Extensive vegetarian menu available
- Vegan: Many dishes can be prepared vegan (ask server)
- Gluten-Free: Several gluten-free options available
- Spice Levels: Mild, Medium, Hot, Extra Hot (customizable)
- Allergies: Please inform server of any allergies

=== POPULAR COMBINATIONS ===
- Thali Platter - $18.99: Complete meal with rice, dal, curry, bread, and dessert
- Family Combo - $45.99: Serves 4 people with variety of dishes
- Lunch Special - $12.99: Available Monday-Friday 11 AM-3 PM
- Weekend Brunch - $16.99: Saturday-Sunday 10 AM-2 PM

SPECIAL INSTRUCTIONS FOR FOOD CARD CLICKS:
When a user clicks on a specific food item, provide a detailed, enthusiastic response that includes:
1. Detailed description of the dish with sensory details
2. Ingredients and cooking methods
3. Cultural background and authenticity
4. Spice level and flavor profile
5. Serving suggestions and pairings
6. EXACT price information from the menu above
7. Chef's recommendation or special note
8. Related dishes they might enjoy

Response Guidelines:
- Always respond with mouth-watering, conversational HTML that makes readers crave our food
- Use vivid, sensory language describing aromas, flavors, textures, and visual appeal
- Focus on authentic Indian cooking techniques, spices, and traditional methods
- MANDATORY: Include 2-3 clickable dish/category links: <a href="#" data-topic="specific dish name" class="text-orange-600 hover:text-orange-800 underline cursor-pointer font-semibold">dish name</a>
- ALWAYS include detailed dish cards with EXACT prices from the menu above
- Create interactive elements like spice level indicators, ingredient highlights, chef recommendations
- Use rich descriptions: "fragrant basmati rice", "tender marinated paneer", "aromatic garam masala blend"
- Include cooking method details: "slow-cooked in a sealed pot", "chargrilled in our tandoor", "simmered for hours"
- Emphasize authenticity, traditional recipes, and family cooking secrets
- Make every description irresistible and crave-worthy
- Always include clickable dish recommendations and related items
- Keep HTML safe and well-structured with elegant styling
- For food-specific queries, be extra detailed and enthusiastic about that particular dish
- ALWAYS use the exact prices listed in the menu above
`;

export async function generateChatResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
  try {
    // Get a contextual dish image based on the user's message
    const contextualDishImageUrl = await pdfImageExtractor.getRandomDishImage();
    const unsplashImageUrl = generateUnsplashImage(userMessage);
    const contextualImageUrl = contextualDishImageUrl || unsplashImageUrl;
    console.log("Using contextual image URL:", contextualImageUrl, contextualDishImageUrl ? "(contextual dish from menu PDF)" : "(from Unsplash)");
    
    // Build conversation context
    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: COMPANY_CONTEXT
      }
    ];

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: `Please provide a mouth-watering, conversational HTML response to: "${userMessage}". 
      
      Your response requirements:
      1. Be enthusiastic about India Palace Restaurant's authentic Indian cuisine
      2. Use clean HTML with Tailwind CSS classes and elegant styling
      3. INCLUDE food images using this placeholder: [FOOD_IMAGE] - this will be replaced with the actual image URL
      4. ALWAYS create detailed dish cards with:
         - Dish name as heading
         - Appetizing description with sensory details
         - Key ingredients highlighted
         - Cooking method (tandoor, dum, slow-cooked, etc.)
         - Spice level indicator (🌶️ symbols)
         - Price information
         - Food image using [FOOD_IMAGE] placeholder
      5. Include 2-3 clickable dish links: <a href="#" data-topic="specific dish name" class="text-orange-600 hover:text-orange-800 underline cursor-pointer font-semibold">Dish Name</a>
      6. Featured dishes to reference: Bharwan Khumh Biryani, Paneer Tikka Dum Biryani, Kathal Biryani, Butter Chicken, Dal Makhani, Tandoori specialties
      7. Use mouth-watering descriptions: "fragrant basmati rice", "tender marinated paneer", "aromatic garam masala", "crispy golden exterior", "melt-in-your-mouth texture"
      8. Include authentic cooking details: "slow-cooked in sealed earthen pot", "chargrilled in traditional tandoor", "simmered with fresh cream and aromatic spices"
      9. Add interactive elements like recommendation buttons, spice preference options, portion size choices
      10. Make every description irresistible and crave-worthy to encourage ordering
      11. Always suggest complementary dishes and beverages
      12. Use [FOOD_IMAGE] placeholder for food images in your HTML: <img src="[FOOD_IMAGE]" alt="Delicious dish" class="rounded-lg shadow-md object-cover" style="width: 300px; height: 200px;">
      13. CRITICAL: Do NOT include any markdown syntax like \`\`\`html or \`\`\` anywhere in your response
      
      Respond only with pure HTML content, no markdown, no code blocks, no additional text or explanations.`
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    let aiResponse = response.choices[0].message.content || "I apologize, but I'm having trouble generating a response right now. Please try again.";
    
    // Clean up any markdown code block syntax that might be included (more comprehensive)
    aiResponse = aiResponse
      .replace(/^```html\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/```html\s*/gi, '')
      .replace(/```\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .replace(/```/gi, '')
      .replace(/`{3,}html/gi, '')
      .replace(/`{3,}/gi, '')
      .trim();
    
    // Remove any existing Unsplash images that might have been included by AI (but keep food images)
    aiResponse = aiResponse.replace(/<img[^>]*alt="[^"]*(?:concept|technology|business)[^"]*"[^>]*>/gi, '');
    
    // Replace placeholder image URLs with the contextual image URL
    aiResponse = aiResponse.replace(/\[FOOD_IMAGE\]/g, contextualImageUrl);
    
    console.log("Final response includes image URL:", contextualImageUrl);
    return aiResponse;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      type: error.type,
      stack: error.stack
    });
    
    // Check for different types of OpenAI API errors
    if (error.code === 'model_not_found' || error.status === 403) {
      const randomDishImageUrl = await pdfImageExtractor.getRandomDishImage();
      const unsplashImageUrl = generateUnsplashImage("restaurant dining setup");
      const errorImageUrl = randomDishImageUrl || unsplashImageUrl;
      console.log("Using error image URL:", errorImageUrl);
      
      return `
        <div class="space-y-4 p-6 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
              <span class="text-amber-600 dark:text-amber-400 font-semibold">⚠</span>
            </div>
            <h3 class="text-lg font-semibold text-amber-800 dark:text-amber-200">OpenAI API Setup Required</h3>
          </div>
          
          <div class="text-amber-700 dark:text-amber-300 space-y-2">
            <p>Your OpenAI API key needs access to chat models. To enable AI culinary responses:</p>
            <ol class="list-decimal list-inside space-y-1 ml-4">
              <li>Visit <a href="https://platform.openai.com" class="underline hover:text-amber-900 dark:hover:text-amber-100" target="_blank">platform.openai.com</a></li>
              <li>Add a payment method under Settings → Billing</li>
              <li>Ensure your project has access to models like gpt-4o-mini</li>
            </ol>
            <p class="text-sm mt-3">Meanwhile, you can explore our menu and see how the culinary chat experience will work once configured.</p>
          </div>
        </div>

        <div class="mt-6 text-center">
          <img src="${errorImageUrl}" alt="${randomDishImageUrl ? 'Delicious dish from our menu' : 'Restaurant culinary setup'}" class="rounded-lg shadow-md object-cover mx-auto" style="width: 235.25px; height: 156.84px;">
        </div>
        `;
    }
    
    // Check for API key issues
    if (error.code === 'invalid_api_key' || error.status === 401) {
      const randomDishImageUrl = await pdfImageExtractor.getRandomDishImage();
      const unsplashImageUrl = generateUnsplashImage("restaurant dining setup");
      const errorImageUrl = randomDishImageUrl || unsplashImageUrl;
      
      return `
        <div class="space-y-4 p-6 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <span class="text-red-600 dark:text-red-400 font-semibold">🔑</span>
            </div>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">OpenAI API Key Required</h3>
          </div>
          
          <div class="text-red-700 dark:text-red-300 space-y-2">
            <p>Please set up your OpenAI API key to enable AI culinary responses:</p>
            <ol class="list-decimal list-inside space-y-1 ml-4">
              <li>Get your API key from <a href="https://platform.openai.com/api-keys" class="underline hover:text-red-900 dark:hover:text-red-100" target="_blank">OpenAI Platform</a></li>
              <li>Set the OPENAI_API_KEY environment variable</li>
              <li>Restart the server</li>
            </ol>
            <p class="text-sm mt-3">You can still explore our menu while setting up the AI features.</p>
          </div>
        </div>

        <div class="mt-6 text-center">
          <img src="${errorImageUrl}" alt="${randomDishImageUrl ? 'Delicious dish from our menu' : 'Restaurant culinary setup'}" class="rounded-lg shadow-md object-cover mx-auto" style="width: 235.25px; height: 156.84px;">
        </div>
        `;
    }
    
    // Check for rate limiting
    if (error.code === 'rate_limit_exceeded' || error.status === 429) {
      const randomDishImageUrl = await pdfImageExtractor.getRandomDishImage();
      const unsplashImageUrl = generateUnsplashImage("restaurant dining setup");
      const errorImageUrl = randomDishImageUrl || unsplashImageUrl;
      
      return `
        <div class="space-y-4 p-6 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <span class="text-yellow-600 dark:text-yellow-400 font-semibold">⏱️</span>
            </div>
            <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Rate Limit Reached</h3>
          </div>
          
          <div class="text-yellow-700 dark:text-yellow-300 space-y-2">
            <p>We've reached the API rate limit. Please try again in a few moments.</p>
            <p class="text-sm">Meanwhile, feel free to explore our menu and come back for AI assistance shortly!</p>
          </div>
        </div>

        <div class="mt-6 text-center">
          <img src="${errorImageUrl}" alt="${randomDishImageUrl ? 'Delicious dish from our menu' : 'Restaurant culinary setup'}" class="rounded-lg shadow-md object-cover mx-auto" style="width: 235.25px; height: 156.84px;">
        </div>
        `;
    }
    
    // Fallback response for any other errors
    const randomDishImageUrl = await pdfImageExtractor.getRandomDishImage();
    const unsplashImageUrl = generateUnsplashImage("restaurant dining setup");
    const errorImageUrl = randomDishImageUrl || unsplashImageUrl;
    
    return `
      <div class="space-y-4 p-6 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
            <span class="text-gray-600 dark:text-gray-400 font-semibold">🤖</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Assistant Temporarily Unavailable</h3>
        </div>
        
        <div class="text-gray-700 dark:text-gray-300 space-y-2">
          <p>I'm experiencing some technical difficulties right now, but I'm still here to help you explore our amazing Indian cuisine!</p>
          <p class="text-sm">Feel free to browse our menu and try again in a moment. Our delicious dishes are always available!</p>
        </div>
      </div>

      <div class="mt-6 text-center">
        <img src="${errorImageUrl}" alt="${randomDishImageUrl ? 'Delicious dish from our menu' : 'Restaurant culinary setup'}" class="rounded-lg shadow-md object-cover mx-auto" style="width: 235.25px; height: 156.84px;">
      </div>
      `;
  }
}

// Function to generate voice response for food card clicks
export async function generateFoodVoiceResponse(foodName: string): Promise<{text: string, html: string}> {
  try {
    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: `You are an enthusiastic AI culinary assistant for India Palace Restaurant. When a user clicks on a food item, provide a detailed, engaging response that can be read aloud.

SPECIAL INSTRUCTIONS FOR FOOD CARD RESPONSES:
- Be extremely enthusiastic and detailed about the specific dish: "${foodName}"
- Provide rich sensory descriptions (aromas, flavors, textures, colors)
- Include cultural background and authenticity details
- Mention key ingredients and cooking methods
- Suggest spice level and flavor profile
- Recommend serving suggestions and pairings
- Include price information if available
- Add chef's special notes or recommendations
- Suggest related dishes they might enjoy
- Make the response conversational and engaging for voice reading
- Keep the response between 150-300 words for optimal voice experience

Response should be natural and flowing for voice synthesis.`
      },
      {
        role: "user",
        content: `The user clicked on "${foodName}" from our menu. Provide a detailed, enthusiastic response about this dish that will be read aloud to them. Include all the sensory details, ingredients, cooking methods, and recommendations.`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.8,
    });

    const voiceText = response.choices[0].message.content || `Welcome to India Palace! The ${foodName} is one of our signature dishes, prepared with authentic Indian spices and traditional cooking methods.`;
    
    // Generate HTML version for display
    const htmlResponse = await generateChatResponse(foodName);
    
    return {
      text: voiceText,
      html: htmlResponse
    };
  } catch (error: any) {
    console.error("OpenAI API error for voice response:", error);
    
    const fallbackText = `Welcome to India Palace! The ${foodName} is one of our signature dishes, prepared with authentic Indian spices and traditional cooking methods. It's a delightful blend of flavors that will transport you to the heart of India.`;
    
    return {
      text: fallbackText,
      html: `<div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 class="text-lg font-bold text-amber-800 mb-2">${foodName}</h3>
        <p class="text-amber-700">${fallbackText}</p>
      </div>`
    };
  }
}

export async function generateWelcomeMessage(): Promise<string> {
  return `
    <div class="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 md:p-8 rounded-2xl border-4 border-amber-300 shadow-2xl" style="background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #fef2f2 100%); border-color: #d4af37;">
      <!-- Decorative Elements - Hidden on mobile -->
      <div class="hidden md:block absolute top-4 right-4 text-4xl opacity-20">🍛</div>
      <div class="hidden md:block absolute bottom-4 left-4 text-3xl opacity-20">🌶️</div>
      <div class="hidden md:block absolute top-1/2 left-4 text-2xl opacity-15">🥘</div>
      
      <!-- Main Content -->
      <div class="relative z-10">
        <!-- Header Section - Compact on mobile -->
        <div class="text-center mb-4 md:mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-2 md:mb-4 shadow-lg">
            <i class="fas fa-robot text-white text-lg md:text-2xl"></i>
          </div>
          <h2 class="text-xl md:text-3xl font-bold text-red-900 mb-1 md:mb-2">🤖 Your AI Culinary Assistant</h2>
          <p class="text-sm md:text-lg text-gray-700 font-medium">Welcome to India Palace Restaurant!</p>
        </div>

        <!-- Features Section - Compact on mobile -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-6 mb-4 md:mb-6 shadow-lg border border-amber-200">
          <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 text-center">✨ Experience Features</h3>
          <div class="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
            <div class="text-center p-2 md:p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
              <div class="text-lg md:text-2xl mb-1 md:mb-2">🎯</div>
              <h4 class="font-semibold text-gray-800 text-xs md:text-sm">AI-Powered</h4>
              <p class="text-xs text-gray-600 hidden md:block">Smart Recommendations</p>
            </div>
            <div class="text-center p-2 md:p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
              <div class="text-lg md:text-2xl mb-1 md:mb-2">👁️</div>
              <h4 class="font-semibold text-gray-800 text-xs md:text-sm">Visual Menu</h4>
              <p class="text-xs text-gray-600 hidden md:block">Explore Dishes</p>
            </div>
            <div class="text-center p-2 md:p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg">
              <div class="text-lg md:text-2xl mb-1 md:mb-2">💬</div>
              <h4 class="font-semibold text-gray-800 text-xs md:text-sm">Interactive Chat</h4>
              <p class="text-xs text-gray-600 hidden md:block">Ask Anything</p>
            </div>
          </div>
          <p class="text-xs md:text-sm text-gray-600 text-center leading-relaxed">
            Ask about ingredients, cooking methods, dietary options, or get personalized dish recommendations!
          </p>
        </div>

        <!-- Action Buttons - Stacked on mobile -->
        <div class="flex flex-col md:flex-row gap-2 md:gap-3 justify-center mb-4 md:mb-6">
          <button class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-sm md:text-base" data-topic="Today's Specials" data-testid="button-todays-specials">
            <i class="fas fa-star mr-1 md:mr-2"></i>Today's Specials
          </button>
          <button class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-sm md:text-base" data-topic="Dietary Options" data-testid="button-dietary">
            <i class="fas fa-leaf mr-1 md:mr-2"></i>Dietary Options
          </button>
        </div>

        <!-- Feature Tags - Compact on mobile -->
        <div class="flex flex-wrap gap-1 md:gap-2 justify-center mb-4 md:mb-6">
          <span class="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-xs md:text-sm rounded-full border border-orange-300 hover:from-orange-200 hover:to-orange-300 transition-all cursor-pointer" data-topic="Fresh Daily" data-testid="tag-fresh">
            <i class="fas fa-seedling mr-1 hidden md:inline"></i>Fresh Daily
          </span>
          <span class="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs md:text-sm rounded-full border border-purple-300 hover:from-purple-200 hover:to-purple-300 transition-all cursor-pointer" data-topic="Chef Crafted" data-testid="tag-crafted">
            <i class="fas fa-user-tie mr-1 hidden md:inline"></i>Chef Crafted
          </span>
          <span class="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs md:text-sm rounded-full border border-green-300 hover:from-green-200 hover:to-green-300 transition-all cursor-pointer" data-topic="Seasonal Menu" data-testid="tag-seasonal">
            <i class="fas fa-calendar-alt mr-1 hidden md:inline"></i>Seasonal Menu
          </span>
          <span class="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs md:text-sm rounded-full border border-blue-300 hover:from-blue-200 hover:to-blue-300 transition-all cursor-pointer" data-topic="Wine Pairings" data-testid="tag-wine">
            <i class="fas fa-wine-glass mr-1 hidden md:inline"></i>Wine Pairings
          </span>
        </div>

        <!-- Call to Action - Compact on mobile -->
        <div class="text-center">
          <div class="inline-flex items-center bg-gradient-to-r from-amber-200 to-orange-200 px-3 md:px-6 py-2 md:py-3 rounded-full shadow-lg">
            <i class="fas fa-magic text-amber-600 mr-1 md:mr-2 text-sm md:text-base"></i>
            <span class="text-amber-800 font-semibold text-xs md:text-base">Interactive Culinary Experience</span>
            <i class="fas fa-magic text-amber-600 ml-1 md:ml-2 text-sm md:text-base"></i>
          </div>
          <p class="text-xs md:text-sm text-gray-600 mt-2 md:mt-3 font-medium">
            Ask me about any dish, ingredient, or dietary preference! 🍽️
          </p>
        </div>
      </div>
    </div>
  `;
}
