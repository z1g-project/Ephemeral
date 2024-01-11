export default function Settings() {
    return (
      <>
        <h1>Settings</h1>
        <div id="settings">
            <h2>Colours</h2>
            <p>Primary Colour:</p><input type="color" id="primarycolour" /><br><br>
            <p>Secondary Colour:</p> <input type="color" id="secondarycolour" /></br></br>
            <p>Tertiary Colour:</p> <input type="color" id="tertiarycolour" /><br><br>
            <hr></hr>
            <h2>Text</h2>
            <p>Text Colour:</p><input type="color" id="textcolour" /></br></br>
            <p>Font:</p><input type="text" id="font" /><br><br>
            <hr></hr>
            <h2>Other</h2>
            <p>Title:</p><input type="text" id="title" /></br></br>
            <p>Favicon:</p><input type="text" id="favicon"></input><br><br>
            <button onclick="updateSettings();">Save Changes</button> <button onclick="localStorage.clear();">Reset Changes</button>
        </div>
      </>
    );
  }
  