const LanguageSelector = ({ onChange }) => {
  const handleLanguageChange = (e) => {
    onChange(e.target.value);
  };
  const selectStyle = {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    // border: "1px solid #ccc",
    // backgroundColor: "#fff",
    cursor: "pointer",
    outline: "none",
  };
  const optionStyle = {
    padding: "0.5rem",
    fontSize: "1rem",
  };

  return (
    <select onChange={handleLanguageChange} id="button1" className="btn" 
    style={selectStyle}
    >
      <option value="ar" style={optionStyle}>
        Arabic
      </option>
      <option value="en" style={optionStyle}>
        English
      </option>
    </select>
  );
};

export default LanguageSelector;
