import React from 'react';

const BootdeyTemplate = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: require('./Bootdeytemplate.html') }} />
  );
};

export default BootdeyTemplate;