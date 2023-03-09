const GalleryItems = ({ items, removeItem }) => {
  console.log(items);
  return (
    <div className="gallery-items">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">
              <input type="checkbox" />
            </th>
            <th scope="col">Önizleme</th>
            <th scope="col">Adı</th>
            <th scope="col">İşlemler</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={`item-${index}`}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <img
                  src={item?.thumbnailFullUrl}
                  alt={item?.thumbnailFullUrl}
                />
              </td>
              <td>{item.name}</td>
              <td>
                <button onClick={removeItem(item.id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default GalleryItems;
