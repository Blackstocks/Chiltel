const ModalLoader = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
          <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    );
  };
  
  export default ModalLoader;
  