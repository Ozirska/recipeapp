const SelectedRecipe = ({ selectedRecipe, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative z-50 bg-white p-8 max-w-full md:max-w-lg mx-auto rounded-md shadow-lg overflow-auto max-h-[90vh]">
        <span
          onClick={closeModal}
          className="absolute top-0 right-0 px-4 cursor-pointer text-gray-600 text-[25px]"
        >
          &times;
        </span>

        <div className="mb-4 text-center">
          <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] mx-auto">
            <img
              className="object-cover w-full h-full rounded-md"
              src={selectedRecipe.photo_url}
              alt="Recipe"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th colSpan="2" className="text-xl pb-2">
                Ingredients
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedRecipe.ingredients &&
              JSON.parse(selectedRecipe.ingredients).map((el, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-2 pr-4 min-w-[120px]">{el.name}</td>
                  <td className="py-2">{el.quantity}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <h3 className="mt-4 text-left text-lg font-semibold">How to cook</h3>
        <p className="whitespace-pre-line break-words mt-2 text-justify">
          {selectedRecipe.description}
        </p>
      </div>
    </div>
  );
};

export default SelectedRecipe;
