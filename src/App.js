import React, { useState, useCallback, useRef, useEffect } from "react";
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, ColorPicker, TextField } from '@shopify/polaris';
import styled from "styled-components";
import { exportComponentAsPNG } from 'react-component-export-image';
import '@shopify/polaris/build/esm/styles.css';
import './App.css';

const convert = require('color-convert');
function App() {
  const [value, setValue] = useState('Your Quote');
  const [textColor, setTextColor] = useState({ hue: 10, brightness: 38, saturation: 19, alpha: 1 });

  const handleChange = useCallback((newValue) => {
    if (newValue.length < 100) {
      setValue(newValue)
    } else {
      alert("text too long");
    }
  }, []);

  const [colorInHex, setColorInHex] = useState(
    `#${convert.hsv.hex(
      textColor.hue,
      textColor.saturation * 100,
      textColor.brightness * 100
    )}`
  );

  useEffect(() => {
    setColorInHex(
      `#${convert.hsv.hex(
        textColor.hue,
        textColor.saturation * 100,
        textColor.brightness * 100
      )}`
    );
  }, [textColor]);

  const handleSubmit = async (e) => {
    exportComponentAsPNG(componentRef);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8001/", {
        method: "POST",
        body: JSON.stringify({
          quote: value,
          color: textColor,
        }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        console.log('Data Received Successfully');
      } else {
        console.log("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const ComponentToPrint = React.forwardRef((props, ref) => (
    <div style={{ marginTop: '2vh' }}>
      <div ref={ref} className="image-div" contentEditable="true"
        suppressContentEditableWarning={true}
        style={{ caretColor: colorInHex }}
      >  <Quote
        fontColor={colorInHex}
        opacity={textColor.alpha}
      >
          {value}
        </Quote></div>
    </div>
  ));

  const componentRef = useRef();

  return (
    <div className='App'>
      <form onSubmit={handleSubmit} action="http://localhost:8001/" method="POST" >
        <AppProvider i18n={enTranslations}>
          <div className="textfield">
            <TextField
              label="Type Your Quote"
              value={value}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </AppProvider>

        <div className="colorPicker">
          <ColorPicker onChange={setTextColor} color={textColor} allowAlpha />
        </div>
        <div>
          <ComponentToPrint ref={componentRef} />
        </div>
        <button className='button' type="submit">Download image</button>
      </form>
    </div>
  );
}
const Quote = styled.p`
font-weight: bolder;
line-height: 1em;
color: ${(props) => props.fontColor};
opacity: ${(props) => props.opacity};
`;
export default App;
