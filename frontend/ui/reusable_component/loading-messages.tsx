import { FileText, MessageSquare } from 'lucide-react';
import React from 'react';

const MessagesLoadingComponent = () => {
  return (
  <div className="flex items-center justify-center h-full py-10">
    <div className="flex flex-col justify-center items-center space-y-3">
      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <div className='flex items-center space-x-2'>
        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>

  );
};

export default MessagesLoadingComponent;