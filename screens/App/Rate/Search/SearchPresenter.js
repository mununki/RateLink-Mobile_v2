import React from "react";
import { View, Text, Subtitle, Spinner, Button, Icon } from "@shoutem/ui";
import dayjs from "dayjs";
import { Query, withApollo } from "react-apollo";
import {
  GET_INPUTPERSONS,
  GET_CLIENTS,
  GET_LINERS,
  GET_LOCATIONS,
  GET_CNTRTYPES
} from "../Rates/RatesQueries";
import { SET_QUERYPARAMS } from "../../../../lib/clientQueries";
import { withNavigation } from "react-navigation";
import {
  Platform,
  DatePickerIOS,
  Modal,
  DatePickerAndroid
} from "react-native";
import {
  AutoComplete,
  AsyncComplete
} from "../../../../components/AutoComplete";

class SearchPresenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenSF: false,
      isOpenST: false,
      options: {
        inputpersons: [],
        clients: [],
        liners: [],
        pols: [],
        pods: [],
        types: []
      },
      queryParams: {
        selectedIp: [],
        selectedCt: [],
        selectedLn: [],
        selectedPl: [],
        selectedPd: [],
        selectedTy: [],
        initialSF: dayjs()
          .subtract(2, "month")
          .startOf("month"),
        initialST: dayjs()
          .add(1, "month")
          .endOf("month")
      }
    };
  }

  componentDidMount() {
    this._loadInputpersons("");
    this._loadClients("");
    this._loadLiners("");
    this._loadCNTRTypes("");
  }

  _loadInputpersons = search => {
    clearTimeout(this.queryAPIInputperson);
    if (search || search === "") {
      this.queryAPIInputperson = setTimeout(
        () =>
          this.props.client
            .query({
              query: GET_INPUTPERSONS,
              variables: { search }
            })
            .then(res =>
              this.setState(prevState => {
                let results = [];
                res.data.getInputpersons.map(ip =>
                  results.push({ label: ip.profile.profile_name, value: ip.id })
                );
                results.sort((a, b) => (a.label > b.label ? 1 : -1));
                return {
                  ...prevState,
                  options: {
                    ...prevState.options,
                    inputpersons: [...results]
                  }
                };
              })
            ),
        500
      );
    }
  };

  _loadClients = search => {
    clearTimeout(this.queryAPIClient);
    if (search || search === "") {
      this.queryAPIClient = setTimeout(
        () =>
          this.props.client
            .query({
              query: GET_CLIENTS,
              variables: { search }
            })
            .then(res =>
              this.setState(prevState => {
                let results = [];
                res.data.getClients.map(ct =>
                  results.push({ label: ct.name, value: ct.id })
                );
                results.sort((a, b) => (a.label > b.label ? 1 : -1));
                return {
                  ...prevState,
                  options: {
                    ...prevState.options,
                    clients: [...results]
                  }
                };
              })
            ),
        500
      );
    }
  };

  _loadLiners = search => {
    clearTimeout(this.queryAPILiner);
    if (search || search === "") {
      this.queryAPILiner = setTimeout(
        () =>
          this.props.client
            .query({
              query: GET_LINERS,
              variables: { search: search, showOurs: true }
            })
            .then(res =>
              this.setState(prevState => {
                let results = [];
                res.data.getLiners.map(ln =>
                  results.push({ label: ln.label, value: ln.id })
                );
                results.sort((a, b) => (a.label > b.label ? 1 : -1));
                return {
                  ...prevState,
                  options: {
                    ...prevState.options,
                    liners: [...results]
                  }
                };
              })
            ),
        500
      );
    }
  };

  _loadPols = search => {
    clearTimeout(this.queryAPIPol);
    return new Promise((resolve, reject) => {
      if (!search || search === "") {
        resolve([]);
      } else {
        this.queryAPIPol = setTimeout(
          () =>
            this.props.client
              .query({
                query: GET_LOCATIONS,
                variables: { search: search, showOurs: true, polOrPod: "pol" }
              })
              .then(res =>
                this.setState(prevState => {
                  let results = [];
                  res.data.getLocations.map(pl =>
                    results.push({ label: pl.name, value: pl.id })
                  );
                  results.sort((a, b) => (a.label > b.label ? 1 : -1));
                  resolve(results);
                })
              ),
          500
        );
      }
    });
  };

  _loadPods = search => {
    clearTimeout(this.queryAPIPod);
    return new Promise((resolve, reject) => {
      if (!search || search === "") {
        resolve([]);
      } else {
        this.queryAPIPod = setTimeout(
          () =>
            this.props.client
              .query({
                query: GET_LOCATIONS,
                variables: { search: search, showOurs: true, polOrPod: "pod" }
              })
              .then(res =>
                this.setState(prevState => {
                  let results = [];
                  res.data.getLocations.map(pd =>
                    results.push({ label: pd.name, value: pd.id })
                  );
                  results.sort((a, b) => (a.label > b.label ? 1 : -1));
                  resolve(results);
                })
              ),
          500
        );
      }
    });
  };

  _loadCNTRTypes = search => {
    clearTimeout(this.queryAPIType);
    if (search || search === "") {
      this.queryAPIType = setTimeout(
        () =>
          this.props.client
            .query({
              query: GET_CNTRTYPES,
              variables: { search: search, showOurs: true }
            })
            .then(res =>
              this.setState(prevState => {
                let results = [];
                res.data.getCNTRtypes.map(ty =>
                  results.push({ label: ty.name, value: ty.id })
                );
                results.sort((a, b) => (a.label > b.label ? 1 : -1));
                return {
                  ...prevState,
                  options: {
                    ...prevState.options,
                    types: [...results]
                  }
                };
              })
            ),
        500
      );
    }
  };

  _setInitialSF = newDate => {
    this.setState(prevState => {
      return {
        ...prevState,
        queryParams: { ...prevState.queryParams, initialSF: dayjs(newDate) }
      };
    });
  };

  _setInitialST = newDate => {
    this.setState(prevState => {
      return {
        ...prevState,
        queryParams: { ...prevState.queryParams, initialST: dayjs(newDate) }
      };
    });
  };

  _toggleSF = () => this.setState({ isOpenSF: !this.state.isOpenSF });
  _toggleST = () => this.setState({ isOpenST: !this.state.isOpenST });

  _handleSearch = () => {
    const { queryParams } = this.state;
    this.props.client
      .mutate({
        mutation: SET_QUERYPARAMS,
        variables: { queryParams }
      })
      .then(res => this.props.navigation.navigate("Rates"));
  };

  _setSelected = (select, target) => {
    this.setState(prevState => {
      return {
        ...prevState,
        queryParams: {
          ...prevState.queryParams,
          [target]: select ? [select] : []
        }
      };
    });
  };

  render() {
    const {
      isOpenSF,
      isOpenST,
      options: { inputpersons, clients, liners, pols, pods, types },
      queryParams: {
        selectedIp,
        selectedCt,
        selectedLn,
        selectedPl,
        selectedPd,
        selectedTy,
        initialSF,
        initialST
      }
    } = this.state;

    return (
      <View>
        <View styleName="sm-gutter">
          <Subtitle>입력자</Subtitle>
          <AutoComplete
            options={inputpersons}
            selected={selectedIp}
            onSelect={select => this._setSelected(select, "selectedIp")}
            loadAsync={this._loadInputpersons}
          />
          <View styleName="horizontal space-between">
            <View styleName="flexible">
              <Subtitle>고객사</Subtitle>
              <AutoComplete
                options={clients}
                selected={selectedCt}
                onSelect={select => this._setSelected(select, "selectedCt")}
                loadAsync={this._loadClients}
              />
            </View>
            <View styleName="flexible">
              <Subtitle>Type</Subtitle>
              <AutoComplete
                options={types}
                selected={selectedTy}
                onSelect={select => this._setSelected(select, "selectedTy")}
                loadAsync={this._loadCNTRTypes}
              />
            </View>
          </View>

          <View styleName="horizontal space-between">
            <View styleName="flexible">
              <Subtitle>선사</Subtitle>
              <AutoComplete
                options={liners}
                selected={selectedLn}
                onSelect={select => this._setSelected(select, "selectedLn")}
                loadAsync={this._loadLiners}
              />
            </View>
            <View styleName="flexible">
              <Subtitle>선적지</Subtitle>
              <AsyncComplete
                selected={selectedPl}
                onSelect={select => this._setSelected(select, "selectedPl")}
                loadAsync={this._loadPols}
              />
            </View>
          </View>

          <Subtitle>도착지</Subtitle>
          <AsyncComplete
            selected={selectedPd}
            onSelect={select => this._setSelected(select, "selectedPd")}
            loadAsync={this._loadPods}
          />
          <View styleName="horizontal space-between">
            <Button
              onPress={
                Platform.OS === "ios"
                  ? () => this._toggleSF()
                  : async () => {
                      try {
                        const {
                          action,
                          year,
                          month,
                          day
                        } = await DatePickerAndroid.open({
                          date: initialSF.toDate()
                        });
                        if (action !== DatePickerAndroid.dismissedAction) {
                          this._setInitialSF(`${year}-${month + 1}-${day}`);
                        }
                      } catch ({ code, message }) {
                        console.warn("Cannot open date picker", message);
                      }
                    }
              }
            >
              <Text>From {initialSF.format("MM-DD")}</Text>
            </Button>
            <Button
              onPress={
                Platform.OS === "ios"
                  ? () => this._toggleST()
                  : async () => {
                      try {
                        const {
                          action,
                          year,
                          month,
                          day
                        } = await DatePickerAndroid.open({
                          date: initialST.toDate()
                        });
                        if (action !== DatePickerAndroid.dismissedAction) {
                          this._setInitialST(`${year}-${month + 1}-${day}`);
                        }
                      } catch ({ code, message }) {
                        console.warn("Cannot open date picker", message);
                      }
                    }
              }
            >
              <Text>To {initialST.format("MM-DD")}</Text>
            </Button>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={isOpenSF}
            onRequestClose={() => console.log("Modal closed!")}
          >
            {Platform.OS === "ios" ? (
              <View styleName="fill-parent vertical v-end">
                <Button onPress={this._toggleSF} styleName="lg-gutter-bottom">
                  <Icon name="close" />
                </Button>
                <DatePickerIOS
                  mode="date"
                  date={initialSF.toDate()}
                  onDateChange={this._setInitialSF}
                />
              </View>
            ) : null}
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={isOpenST}
            onRequestClose={() => console.log("Modal closed!")}
          >
            {Platform.OS === "ios" ? (
              <View styleName="fill-parent vertical v-end">
                <Button onPress={this._toggleST} styleName="lg-gutter-bottom">
                  <Icon name="close" />
                </Button>
                <DatePickerIOS
                  mode="date"
                  date={initialST.toDate()}
                  onDateChange={this._setInitialST}
                />
              </View>
            ) : null}
          </Modal>
        </View>
        <Button
          styleName="secondary xl-gutter-vertical"
          onPress={() => this._handleSearch()}
        >
          <Icon name="search" />
          <Text>SEARCH</Text>
        </Button>
      </View>
    );
  }
}

export default withNavigation(withApollo(SearchPresenter));
