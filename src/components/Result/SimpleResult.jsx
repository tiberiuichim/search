const SimpleResult = (props) => {
  const {
    result,
    titleField,
    // urlField,
    // summaryField,
    extraFields = [],
  } = props;
  // console.log('resprops', props);

  return (
    <div className="simple-item">
      <h4>{result[titleField].raw}</h4>
      {extraFields.map(({ field, label }, i) => (
        <div className="simple-item-extra" key={i}>
          <strong>{label}:</strong> <em>{result[field].raw}</em>
        </div>
      ))}
    </div>
  );
};

export default SimpleResult;
