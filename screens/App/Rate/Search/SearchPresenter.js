import React from "react";
import {
  DropDownMenu,
  View,
  Text,
  Subtitle,
  Spinner,
  Button,
  Icon
} from "@shoutem/ui";
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
import { Platform, DatePickerIOS, Modal } from "react-native";

class SearchPresenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpenSF: false,
      isOpenST: false,
      options: {
        inputpersons: [{ label: "(선택없음)", value: 0 }],
        clients: [{ label: "(선택없음)", value: 0 }],
        liners: [{ label: "(선택없음)", value: 0 }],
        pols: [{ label: "(선택없음)", value: 0 }],
        pods: [{ label: "(선택없음)", value: 0 }],
        types: [{ label: "(선택없음)", value: 0 }]
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
    this._loadInputpersons();
    this._loadClients();
    this._loadLiners();
    this._loadPols();
    this._loadPods();
    this._loadCNTRTypes();
  }

  _loadInputpersons = () =>
    this.props.client
      .query({
        query: GET_INPUTPERSONS,
        variables: { search: "" }
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
              inputpersons: [prevState.options.inputpersons[0], ...results]
            }
          };
        })
      );

  _loadClients = () =>
    this.props.client
      .query({
        query: GET_CLIENTS,
        variables: { search: "" }
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
              clients: [prevState.options.clients[0], ...results]
            }
          };
        })
      );

  _loadLiners = () =>
    this.props.client
      .query({
        query: GET_LINERS,
        variables: { search: "", showOurs: true }
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
              liners: [prevState.options.liners[0], ...results]
            }
          };
        })
      );

  _loadPols = () =>
    this.props.client
      .query({
        query: GET_LOCATIONS,
        variables: { search: "", showOurs: true, polOrPod: "pol" }
      })
      .then(res =>
        this.setState(prevState => {
          let results = [];
          res.data.getLocations.map(pl =>
            results.push({ label: pl.name, value: pl.id })
          );
          results.sort((a, b) => (a.label > b.label ? 1 : -1));
          return {
            ...prevState,
            options: {
              ...prevState.options,
              pols: [prevState.options.pols[0], ...results]
            }
          };
        })
      );

  _loadPods = () =>
    this.props.client
      .query({
        query: GET_LOCATIONS,
        variables: { search: "", showOurs: true, polOrPod: "pod" }
      })
      .then(res =>
        this.setState(prevState => {
          let results = [];
          res.data.getLocations.map(pd =>
            results.push({ label: pd.name, value: pd.id })
          );
          results.sort((a, b) => (a.label > b.label ? 1 : -1));
          return {
            ...prevState,
            options: {
              ...prevState.options,
              pods: [prevState.options.pods[0], ...results]
            }
          };
        })
      );

  _loadCNTRTypes = () =>
    this.props.client
      .query({
        query: GET_CNTRTYPES,
        variables: { search: "", showOurs: true }
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
              types: [prevState.options.types[0], ...results]
            }
          };
        })
      );

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
      <View styleName="fill-parent vertical space-between">
        <Subtitle>입력자</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={inputpersons}
          selectedOption={
            selectedIp.length > 0 ? selectedIp[0] : inputpersons[0]
          }
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                queryParams: {
                  ...prevState.queryParams,
                  selectedIp: [select]
                }
              };
            })
          }
          titleProperty="label"
          valueProperty="value"
        />
        <Subtitle>고객사</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={clients}
          selectedOption={selectedCt.length > 0 ? selectedCt[0] : clients[0]}
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                queryParams: {
                  ...prevState.queryParams,
                  selectedCt: [select]
                }
              };
            })
          }
          titleProperty="label"
          valueProperty="value"
        />
        <Subtitle>선사</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={liners}
          selectedOption={selectedLn.length > 0 ? selectedLn[0] : liners[0]}
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                queryParams: {
                  ...prevState.queryParams,
                  selectedLn: [select]
                }
              };
            })
          }
          titleProperty="label"
          valueProperty="value"
        />
        <Subtitle>선적지</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={pols}
          selectedOption={selectedPl.length > 0 ? selectedPl[0] : pols[0]}
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                queryParams: {
                  ...prevState.queryParams,
                  selectedPl: [select]
                }
              };
            })
          }
          titleProperty="label"
          valueProperty="value"
        />
        <Subtitle>도착지</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={pods}
          selectedOption={selectedPd.length > 0 ? selectedPd[0] : pods[0]}
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                queryParams: {
                  ...prevState.queryParams,
                  selectedPd: [select]
                }
              };
            })
          }
          titleProperty="label"
          valueProperty="value"
        />
        <Subtitle>Type</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={types}
          selectedOption={selectedTy.length > 0 ? selectedTy[0] : types[0]}
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                queryParams: {
                  ...prevState.queryParams,
                  selectedTy: [select]
                }
              };
            })
          }
          titleProperty="label"
          valueProperty="value"
        />
        <View styleName="horizontal space-between">
          <Button onPress={() => this._toggleSF()}>
            <Text>From</Text>
          </Button>
          <Button onPress={() => this._toggleST()}>
            <Text>To</Text>
          </Button>
        </View>
        <Modal animationType="slide" transparent={false} visible={isOpenSF}>
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
        <Modal animationType="slide" transparent={false} visible={isOpenST}>
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
