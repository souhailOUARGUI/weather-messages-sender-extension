document
  .getElementById("weather-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    // const msgType = document.getElementById("msgType").value;
    // const station = document.getElementById("station").value;
    // const temperature = document.getElementById("temperature").value;
    // const pressure = document.getElementById("pressure").value;
    // const humidity = document.getElementById("humidity").value;

    const message = document.getElementById("message").value;
    const parsedData = parseMessage(message);
    // console.log(JSON.stringify(parsedData));
    // const testData = {
    //   message: "S0dfssgsdgskjgihkjkhlhpojmpo 15555",
    //   type: "Metar",
    //   timestamp: "2024-07-23T00:00:00.000Z",
    //   station: "GMME",
    //   wind_direction: 270,
    //   wind_speed: 8,
    //   windGust: 0,
    //   temperature: 22,
    //   dew_point: 16,
    //   weather: ["BKN050"],
    //   cloud_coverage: "BKN050",
    //   visibility: "9000",
    //   remarks: "",
    // };

    try {
      const response = await fetch("http://localhost:3000/messages/metars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
        // body: JSON.stringify(parsedData),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          alert("Weather message sent successfully!");
        })
        .catch((error) => {
          console.error("error fetching data:", error);
        });
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending weather message.");
    }
  });

function parseMessage(msg) {
  const parts = msg.split(" ");
  const type = parts[0];
  const station = parts[1];
  const timestamp = parts[2];
  const windInfo = parts[3];
  const visibility = parts[4];
  const weather = parts[5];
  const temperatureAndDewPoint = parts[6].split("/");
  const pressure = parts[7].substring(1);
  const remarks = parts[8];

  const windDirection = parseInt(windInfo.substring(0, 3));
  const windSpeed = parseInt(windInfo.substring(3, 5));
  const windUnit = parseInt(windInfo.slice(5));
  console.log(windInfo);
  console.log(windUnit);
  // windInfo.length > 5 ? parseInt(windInfo.substring(5, 7)) : "no unit";
  const temp = parseInt(temperatureAndDewPoint[0]);
  const dewPoint = parseInt(temperatureAndDewPoint[1]);

  const msgDate = parseMessageTimestamp(timestamp);

  return {
    message: msg,
    timestamp: msgDate,
    type,
    station,
    wind_direction: windDirection,
    wind_speed: windSpeed,
    wind_unit: windUnit,
    visibility: visibility,
    weather: weather,
    // cloud_coverage: visibility === "CAVOK" ? "CAVOK" : "",
    temperature: temp,
    dew_point: dewPoint,
    remarks,
    pressure: pressure,
  };
}

function parseMessageTimestamp(timestamp) {
  const day = parseInt(timestamp.substring(0, 2));
  const hour = parseInt(timestamp.substring(2, 4));
  const minute = parseInt(timestamp.substring(4, 6));
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  return new Date(Date.UTC(year, month, day, hour, minute));
}
