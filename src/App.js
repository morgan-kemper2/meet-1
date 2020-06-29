import React, { Component } from "react";
import "./App.css";
import EventList from "./EventList";
import CitySearch from "./CitySearch";
import NumberOfEvents from "./NumberOfEvents";
import { getEvents } from "./api";
import { OfflineAlert } from "./Alert";
import moment from "moment";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* const App = () => {
  const [events, setEvents] = useState(undefined);
  const token = getAccessToken();

  useEffect(() => {
    getEvents().then((response) => this.setState({ events: response.events }));
    window.addEventListener("online", this.offLineAlert());
    return () => {
      window.removeEventListener("online", this.offLineAlert());
    };
  }, []);

  useEffect(() => {
    getEvents().then((response) => this.setState({ events: response.events }));
  }, [token]);
};
 */
class App extends Component {
  componentDidMount() {
    getEvents().then((response) => this.setState({ events: response }));
    window.addEventListener("online", this.offLineAlert());
  }

  state = {
    events: [],
    page: null,
    defaultCity: "",
    offlineText: "",
    numberOfEvents: 5,
  };

  offLineAlert = () => {
    if (navigator.onLine === false) {
      this.setState({
        offlineText:
          "You appear to be offline, this list is cached. Please connect to the internet for an updated list.",
      });
    } else {
      this.setState({
        offlineText: "",
      });
    }
  };

  countEventsOnADate = (date) => {
    // This should always return 0 untill we ensure the dates are the same format
    const count = this.state.events.filter(
      (event) => event.start.dateTime === date
    );
    return count.length;
  };

  getData = () => {
    const currentDate = moment().add(7, "d").format("YYYY-MM-DD HH:mm"); //next 7 days
    //{ date: dateString, number: count } format
    const next7Days = this.state.events.filter((event) => {
      const eventDate = moment(
        event.start.dateTime,
        "YYYY-MM-DD HH:mm"
      ).toDate();

      return eventDate <= currentDate;
    });
    console.log("next7Days", next7Days);
    return next7Days;
  };

  updateEvents = (location, numberOfEvents) => {
    if (location) {
      getEvents(numberOfEvents).then((response) =>
        this.setState({
          events: response.events.filter(
            (event) => event.location === location
          ),
        })
      );
    } else {
      getEvents(numberOfEvents).then((response) =>
        this.setState({
          events: response.events,
          numberOfEvents: numberOfEvents,
        })
      );
    }
  };

  render() {
    return (
      <div className="App">
        <CitySearch
          updateEvents={this.updateEvents}
          defaultCity={this.state.defaultCity}
        />
        <OfflineAlert text={this.state.offlineText} />
        <NumberOfEvents updateEvents={this.updateEvents} numberOfEvents={2} />
        {/* <ResponsiveContainer height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="category" dataKey="date" name="date" />
            <YAxis
              allowDecimals={false}
              type="number"
              dataKey="number"
              name="number of events"
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="A school" data={this.getData()} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer> */}
        <EventList events={this.state.events} />
      </div>
    );
  }
}

export default App;
