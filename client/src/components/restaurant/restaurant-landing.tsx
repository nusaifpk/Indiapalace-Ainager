import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import food images
import koshari from "@/assets/foods/koshari.jpg";
import bistek from "@/assets/foods/bistek.jpg";
import corba from "@/assets/foods/corba.jpg";
import shawarma from "@/assets/foods/shawarma.jpg";
import dalfry from "@/assets/foods/dalfry.jpg";
import burek from "@/assets/foods/burek.jpg";
import lasagne from "@/assets/foods/lasagne.jpg";
import moussaka from "@/assets/foods/moussaka.jpg";
import tamiya from "@/assets/foods/tamiya.jpg";

interface RestaurantLandingProps {
  onFoodClick: (foodName: string, foodImage: string) => void;
}

export function RestaurantLanding({ onFoodClick }: RestaurantLandingProps) {
  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFoodClick = (foodName: string, foodImage: string) => {
    onFoodClick(foodName, foodImage);
    scrollToChat();
  };

  // Branch data with unique signature dishes
  const branches = [
    {
      id: 'main',
      name: 'India Palace - Main Branch',
      cuisine: 'Authentic Indian',
      location: '123 Main Street, Downtown District',
      phone: '(555) 123-4567',
      signatureDishes: [
        'Royal Chicken Biryani',
        'Butter Chicken Deluxe',
        'Tandoori Mixed Grill',
        'Dal Makhani Special',
        'Naan Bread Basket'
      ],
      description: 'Our flagship location serving traditional Indian cuisine with royal flavors and authentic spices.'
    },
    {
      id: 'chinese',
      name: 'India Palace - Chinese Fusion',
      cuisine: 'Indo-Chinese',
      location: '456 East Avenue, Chinatown District',
      phone: '(555) 234-5678',
      signatureDishes: [
        'Schezwan Chicken',
        'Hakka Noodles',
        'Gobi Manchurian',
        'Chilli Paneer',
        'Fried Rice Special'
      ],
      description: 'Experience the perfect blend of Indian spices with Chinese cooking techniques in our fusion branch.'
    },
    {
      id: 'continental',
      name: 'India Palace - Continental',
      cuisine: 'Continental & European',
      location: '789 West Boulevard, Uptown District',
      phone: '(555) 345-6789',
      signatureDishes: [
        'Grilled Salmon',
        'Chicken Cordon Bleu',
        'Pasta Carbonara',
        'Beef Stroganoff',
        'Caesar Salad'
      ],
      description: 'Our continental branch offers European classics with Indian-inspired twists and premium ingredients.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-orange-900/90"></div>
        <div className="absolute inset-0 bg-[url('/assets/biryani-hero.png')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-utensils text-white text-3xl"></i>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              🏛️ India Palace
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-6 text-amber-100">
              Authentic Indian Cuisine & Royal Dining Experience
            </p>
            <p className="text-lg md:text-xl text-amber-200 max-w-2xl mx-auto mb-8">
              Experience the rich flavors of India with our traditional recipes, 
              premium ingredients, and warm hospitality that makes every meal memorable.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl"
            >
              <i className="fas fa-book-open mr-2"></i>
              View Menu
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToChat}
              className="border-2 border-amber-300 text-red-900 hover:bg-amber-300 hover:text-red-900 px-8 py-4 text-lg font-semibold rounded-full"
            >
              <i className="fas fa-comments mr-2"></i>
              Ask Our AI Chef
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-white text-2xl"></i>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
              Why Choose India Palace?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring you the authentic taste of India with modern convenience and exceptional service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 border-amber-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-leaf text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-4">Fresh Ingredients</h3>
                <p className="text-gray-600">
                  We source the finest spices and ingredients directly from India to ensure authentic flavors in every dish.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-2 border-amber-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-users text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-4">Expert Chefs</h3>
                <p className="text-gray-600">
                  Our master chefs bring decades of experience and traditional cooking techniques to create exceptional dishes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-2 border-amber-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-robot text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-4">AI Assistant</h3>
                <p className="text-gray-600">
                  Get personalized recommendations and answers about our menu, ingredients, and dietary preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
              Signature Dishes
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular and authentic Indian delicacies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Koshari Rice Bowl",
                description: "Traditional Egyptian-inspired rice dish with lentils, chickpeas, and aromatic spices",
                price: "$16.99",
                image: koshari
              },
              {
                name: "Bistek Tagalog",
                description: "Filipino-style beef steak with onions and soy sauce marinade",
                price: "$18.99",
                image: bistek
              },
              {
                name: "Turkish Corba Soup",
                description: "Hearty Turkish soup with vegetables, herbs, and traditional spices",
                price: "$12.99",
                image: corba
              },
              {
                name: "Middle Eastern Shawarma",
                description: "Spiced meat wrapped in flatbread with fresh vegetables and tahini sauce",
                price: "$15.99",
                image: shawarma
              },
              {
                name: "Dal Fry Special",
                description: "Crispy fried lentils with onions, tomatoes, and aromatic Indian spices",
                price: "$13.99",
                image: dalfry
              },
              {
                name: "Turkish Burek",
                description: "Flaky pastry filled with cheese, meat, or vegetables, baked to perfection",
                price: "$8.99",
                image: burek
              },
              {
                name: "Italian Lasagne",
                description: "Layered pasta with rich meat sauce, cheese, and béchamel sauce",
                price: "$19.99",
                image: lasagne
              },
              {
                name: "Greek Moussaka",
                description: "Layered eggplant casserole with spiced meat and creamy béchamel sauce",
                price: "$17.99",
                image: moussaka
              },
              {
                name: "Egyptian Tamiya",
                description: "Traditional Egyptian falafel made with fava beans and aromatic herbs",
                price: "$7.99",
                image: tamiya
              }
            ].map((dish, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-amber-200 hover:border-orange-400 cursor-pointer transform hover:scale-105"
                onClick={() => handleFoodClick(dish.name, dish.image)}
              >
                <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${dish.image})`}}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-red-900">{dish.name}</h3>
                    <span className="text-lg font-bold text-orange-600">{dish.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{dish.description}</p>
                  <div className="mt-3 text-center">
                    <span className="text-sm text-orange-600 font-medium">
                      <i className="fas fa-comments mr-1"></i>
                      Click to ask about this dish
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl"
            >
              <i className="fas fa-utensils mr-2"></i>
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-red-900 mb-8">
            Visit Us Today
          </h2>
          
          {/* Our Branches Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-red-900 mb-8">
              <i className="fas fa-store mr-2 text-orange-500"></i>
              Our Branches
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <Card key={branch.id} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-amber-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-red-900 mb-2">{branch.name}</h4>
                      <span className="inline-block bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {branch.cuisine}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <i className="fas fa-map-marker-alt text-orange-500 mt-1"></i>
                        <p className="text-sm text-gray-600">{branch.location}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-phone text-orange-500"></i>
                        <p className="text-sm text-gray-600 font-medium">{branch.phone}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-800 mb-2">Signature Dishes:</h5>
                      <div className="space-y-1">
                        {branch.signatureDishes.map((dish, index) => (
                          <p key={index} className="text-xs text-gray-600">• {dish}</p>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 italic">{branch.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-red-900 mb-4">
                <i className="fas fa-clock mr-2 text-orange-500"></i>
                Hours
              </h3>
              <div className="space-y-2 text-lg text-gray-600">
                <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                <p>Friday - Saturday: 11:00 AM - 11:00 PM</p>
                <p>Sunday: 12:00 PM - 9:00 PM</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-red-900 mb-4">
                <i className="fas fa-info-circle mr-2 text-orange-500"></i>
                Quick Info
              </h3>
              <div className="space-y-2 text-lg text-gray-600">
                <p>All branches open 7 days a week</p>
                <p>Free delivery within 5 miles</p>
                <p>Reservations recommended for weekends</p>
                <p>Private dining available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-8 border-2 border-amber-200">
            <h3 className="text-2xl font-bold text-red-900 mb-4">
              <i className="fas fa-phone mr-2 text-orange-500"></i>
              Contact Us
            </h3>
            <p className="text-lg text-gray-600 mb-4">Ready to experience authentic Indian cuisine?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 font-semibold rounded-full"
              >
                <i className="fas fa-phone mr-2"></i>
                Call (555) 123-4567
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToChat}
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-6 py-3 font-semibold rounded-full"
              >
                <i className="fas fa-comments mr-2"></i>
                Chat with AI Chef
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
