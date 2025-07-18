
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, MessageCircle, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 🌸 Soy Pili Bot, tu asistente virtual de Florería Pili. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Horarios
    if (message.includes('horario') || message.includes('hora') || message.includes('abierto')) {
      return '🕐 Nuestros horarios son:\n• Lunes - Viernes: 9:00 AM - 7:00 PM\n• Sábados: 9:00 AM - 6:00 PM\n• Domingos: 10:00 AM - 4:00 PM';
    }
    
    // Delivery
    if (message.includes('delivery') || message.includes('envio') || message.includes('entregar')) {
      return '🚚 ¡Sí, hacemos delivery! Entregamos en toda la ciudad. El costo del delivery varía según la zona. ¿Me podrías decir tu dirección para darte el precio exacto?';
    }
    
    // Precios
    if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
      return '💰 Nuestros precios varían según el tipo de arreglo:\n• Ramos simples: desde S/25\n• Arreglos medianos: S/45 - S/80\n• Arreglos grandes: S/90 - S/150\n• Amigurumis: S/35 - S/60\n\n¿Te interesa algún tipo en particular?';
    }
    
    // Productos
    if (message.includes('producto') || message.includes('flores') || message.includes('ramo') || message.includes('arreglo')) {
      return '🌸 Tenemos una gran variedad:\n• Ramos de rosas, girasoles, claveles\n• Arreglos florales personalizados\n• Amigurumis tejidos a mano\n• Flores preservadas\n• Plantas decorativas\n\n¿Qué tipo de ocasión es?';
    }
    
    // Ocasiones
    if (message.includes('cumpleaños') || message.includes('aniversario') || message.includes('san valentin') || message.includes('madre')) {
      return '🎉 ¡Perfecto! Tenemos arreglos especiales para cada ocasión. Te recomiendo nuestros arreglos personalizados. ¿Te gustaría ver el catálogo o prefieres que te asesore con algo específico?';
    }
    
    // Personalización
    if (message.includes('personalizar') || message.includes('diseño') || message.includes('especial')) {
      return '🎨 ¡Claro! Podemos personalizar tu arreglo con:\n• Colores específicos\n• Mensaje personalizado\n• Tipos de flores favoritas\n• Tamaño del arreglo\n• Accesorios especiales\n\n¿Qué tienes en mente?';
    }
    
    // Pago
    if (message.includes('pago') || message.includes('pagar') || message.includes('transferencia') || message.includes('yape')) {
      return '💳 Aceptamos varios métodos de pago:\n• Efectivo contra entrega\n• Yape / Plin\n• Transferencia bancaria\n• QR de pago\n\nTodos nuestros pagos son seguros y verificados.';
    }
    
    // Contacto directo
    if (message.includes('hablar') || message.includes('contactar') || message.includes('humano') || message.includes('persona')) {
      return '📞 Si necesitas hablar directamente con nosotros:\n• WhatsApp: +51 987 654 321\n• Teléfono: +51 987 654 321\n• Email: info@floreriapili.com\n\n¡Estamos aquí para ayudarte! 😊';
    }
    
    // Ubicación
    if (message.includes('ubicacion') || message.includes('direccion') || message.includes('donde') || message.includes('tienda')) {
      return '📍 Nos encuentras en el centro de la ciudad. Para delivery, cubrimos toda el área metropolitana. ¿Necesitas que te envíe la ubicación exacta?';
    }
    
    // Cuidados
    if (message.includes('cuidar') || message.includes('mantener') || message.includes('durar')) {
      return '🌱 Para que tus flores duren más:\n• Cambiar el agua cada 2 días\n• Cortar los tallos en diagonal\n• Mantener lejos del sol directo\n• Agregar azúcar al agua\n\n¡Así durarán hasta 10 días! 💖';
    }
    
    // Saludos
    if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
      return '¡Hola! 🌸 ¡Qué gusto saludarte! ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros productos, precios, horarios o cualquier duda que tengas.';
    }
    
    // Despedidas
    if (message.includes('gracias') || message.includes('chau') || message.includes('adiós') || message.includes('bye')) {
      return '¡De nada! 🌸 Fue un placer ayudarte. Si necesitas algo más, estaré aquí. ¡Que tengas un día florido! 💐';
    }
    
    // Respuesta por defecto
    return '🤔 Entiendo tu consulta, pero me gustaría ayudarte mejor. Puedes preguntarme sobre:\n• Precios y productos 💰\n• Horarios de atención 🕐\n• Delivery y envíos 🚚\n• Personalización 🎨\n• Métodos de pago 💳\n\n¿Sobre qué te gustaría saber?';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[500px] bg-white shadow-2xl animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-floral-pink to-floral-rose text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">Pili Bot 🌸</CardTitle>
                <p className="text-sm opacity-90">Asistente Virtual</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-[400px] p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 bg-floral-pink rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-2xl whitespace-pre-line ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-floral-pink text-white'
                  }`}
                >
                  {message.text}
                </div>
                {!message.isBot && (
                  <div className="w-8 h-8 bg-floral-green rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-floral-pink rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-floral-pink hover:bg-floral-pink-dark"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
