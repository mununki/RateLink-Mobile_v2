import React from "react";
import { Modal, DatePickerIOS, Platform } from "react-native";
import {
  View,
  Text,
  Button,
  Subtitle,
  DropDownMenu,
  Icon,
  TextInput,
  Caption
} from "@shoutem/ui";
import { ME } from "../../../../queries/sharedQueries";
import dayjs from "dayjs";
import { withApollo } from "react-apollo";
import {
  GET_RATES,
  GET_CLIENTS,
  GET_LINERS,
  GET_LOCATIONS,
  GET_CNTRTYPES
} from "../Rates/RatesQueries";
import { SET_RATE } from "./AddQueries";
import { withNavigation } from "react-navigation";
import { GET_QUERYPARAMS } from "../../../../lib/clientQueries";

class AddPresenter extends React.Component {
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
      newRate: {
        selectedIp: [],
        selectedCt: [],
        selectedLn: [],
        selectedPl: [],
        selectedPd: [],
        selectedTy: [],
        buying20: 0,
        buying40: 0,
        buying4H: 0,
        selling20: 0,
        selling40: 0,
        selling4H: 0,
        loadingFT: 0,
        dischargingFT: 0,
        offeredDate: dayjs(),
        effectiveDate: dayjs().endOf("month"),
        remark: ""
      }
    };
  }

  async componentDidMount() {
    await this._loadMe();
    await this._loadClients();
    await this._loadLiners();
    await this._loadPols();
    await this._loadPods();
    await this._loadCNTRTypes();
    if (this.props.rate) {
      this._loadPrevRate();
    }
  }

  _loadPrevRate = () => {
    const { rate } = this.props;
    const { options } = this.state;
    const indexOfClient = options.clients.findIndex(
      ct => ct.value === rate.client.id
    );
    const indexOfLiner = options.liners.findIndex(
      ln => ln.value === rate.liner.id
    );
    const indexOfPol = options.pols.findIndex(pl => pl.value === rate.pol.id);
    const indexOfPod = options.pods.findIndex(pd => pd.value === rate.pod.id);
    const indexOfType = options.types.findIndex(
      ty => ty.value === rate.cntrtype.id
    );
    this.setState(prevState => {
      return {
        ...prevState,
        newRate: {
          selectedCt: [options.clients[indexOfClient]],
          selectedLn: [options.liners[indexOfLiner]],
          selectedPl: [options.pols[indexOfPol]],
          selectedPd: [options.pods[indexOfPod]],
          selectedTy: [options.types[indexOfType]],
          buying20: rate.buying20,
          buying40: rate.buying40,
          buying4H: rate.buying4H,
          selling20: rate.selling20,
          selling40: rate.selling40,
          selling4H: rate.selling4H,
          loadingFT: rate.loadingFT,
          dischargingFT: rate.dischargingFT,
          offeredDate: dayjs(rate.offeredDate),
          effectiveDate: dayjs(rate.effectiveDate),
          remark: rate.remark
        }
      };
    });
  };

  _loadMe = () =>
    this.props.client
      .query({
        query: ME
      })
      .then(res =>
        this.setState(prevState => {
          const myProfile = {
            label: res.data.me.data.profile.profile_name,
            value: res.data.me.data.id
          };
          return {
            ...prevState,
            options: {
              ...prevState.options,
              inputpersons: [myProfile]
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
        variables: { search: "", showOurs: false }
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
        variables: { search: "", showOurs: false, polOrPod: "pol" }
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
        variables: { search: "", showOurs: false, polOrPod: "pod" }
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
        variables: { search: "", showOurs: false }
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
        newRate: { ...prevState.newRate, offeredDate: dayjs(newDate) }
      };
    });
  };

  _setInitialST = newDate => {
    this.setState(prevState => {
      return {
        ...prevState,
        newRate: { ...prevState.newRate, effectiveDate: dayjs(newDate) }
      };
    });
  };

  _toggleSF = () => this.setState({ isOpenSF: !this.state.isOpenSF });
  _toggleST = () => this.setState({ isOpenST: !this.state.isOpenST });

  _handleChangeText = (text, target) => {
    this.setState(prevState => {
      return {
        ...prevState,
        newRate: { ...prevState.newRate, [target]: text }
      };
    });
  };

  _handleSave = () => {
    const { newRate } = this.state;
    this.props.client
      .mutate({
        mutation: SET_RATE,
        variables: {
          newRate: JSON.stringify(newRate),
          handler: "add"
        }
      })
      .then(res => {
        const { queryParams } = this.props.client.readQuery({
          query: GET_QUERYPARAMS
        });
        const { getRates } = this.props.client.readQuery({
          query: GET_RATES,
          variables: {
            first: 20,
            queryParams: JSON.stringify(queryParams),
            after: null
          }
        });
        this.props.client.writeQuery({
          query: GET_RATES,
          variables: {
            first: 20,
            queryParams: JSON.stringify(queryParams),
            after: null
          },
          data: {
            getRates: {
              ...getRates,
              data: {
                ...getRates.data,
                edges: [
                  ...res.data.setRate.map(edge => {
                    const newEdge = {
                      cursor: edge.id,
                      node: edge,
                      __typename: "Rate_rateEdge"
                    };
                    return newEdge;
                  }),
                  ...getRates.data.edges
                ]
              }
            }
          }
        });
      })
      .then(() => this.props.navigation.navigate("Rates"));
  };

  _handleModify = () => {
    const { rate } = this.props;
    const { newRate } = this.state;
    this.props.client
      .mutate({
        mutation: SET_RATE,
        variables: {
          newRate: JSON.stringify(newRate),
          handler: "modify",
          rateId: rate.id
        }
      })
      .then(() => this.props.navigation.navigate("Rates"));
  };

  render() {
    const { rate } = this.props;
    const {
      isOpenSF,
      isOpenST,
      options: { clients, liners, pols, pods, types },
      newRate: {
        selectedCt,
        selectedLn,
        selectedPl,
        selectedPd,
        selectedTy,
        buying20,
        buying40,
        buying4H,
        selling20,
        selling40,
        selling4H,
        loadingFT,
        dischargingFT,
        offeredDate,
        effectiveDate,
        remark
      }
    } = this.state;

    return (
      <View>
        <Subtitle>고객사</Subtitle>
        <DropDownMenu
          styleName="horizontal"
          options={clients}
          selectedOption={selectedCt.length > 0 ? selectedCt[0] : clients[0]}
          onOptionSelected={select =>
            this.setState(prevState => {
              return {
                ...prevState,
                newRate: {
                  ...prevState.newRate,
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
                newRate: {
                  ...prevState.newRate,
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
                newRate: {
                  ...prevState.newRate,
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
                newRate: {
                  ...prevState.newRate,
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
                newRate: {
                  ...prevState.newRate,
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
        <Caption>Buying</Caption>
        <View styleName="horizontal space-between">
          <TextInput
            styleName="flexible"
            placeholder={`20'`}
            value={`${buying20}`}
            onChangeText={text => this._handleChangeText(text, "buying20")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
          <TextInput
            styleName="flexible"
            placeholder={`40'`}
            value={`${buying40}`}
            onChangeText={text => this._handleChangeText(text, "buying40")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
          <TextInput
            styleName="flexible"
            placeholder={`40'HC`}
            value={`${buying4H}`}
            onChangeText={text => this._handleChangeText(text, "buying4H")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
        </View>
        <Caption>Selling</Caption>
        <View styleName="horizontal space-between">
          <TextInput
            styleName="flexible"
            placeholder={`20'`}
            value={`${selling20}`}
            onChangeText={text => this._handleChangeText(text, "selling20")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
          <TextInput
            styleName="flexible"
            placeholder={`40'`}
            value={`${selling40}`}
            onChangeText={text => this._handleChangeText(text, "selling40")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
          <TextInput
            styleName="flexible"
            placeholder={`40'HC`}
            value={`${selling4H}`}
            onChangeText={text => this._handleChangeText(text, "selling4H")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
        </View>
        <Caption>REMARK</Caption>
        <View styleName="horizontal">
          <TextInput
            styleName="flexible"
            placeholder={"REMARK"}
            onChangeText={text => this._handleChangeText(text, "remark")}
            style={{ borderWidth: 1, borderColor: "#eee" }}
          />
        </View>
        <Button
          styleName="secondary"
          onPress={
            !rate ? () => this._handleSave() : () => this._handleModify()
          }
        >
          <Text>SAVE</Text>
        </Button>
        <Modal animationType="slide" transparent={false} visible={isOpenSF}>
          {Platform.OS === "ios" ? (
            <View styleName="fill-parent vertical v-end">
              <Button onPress={this._toggleSF} styleName="lg-gutter-bottom">
                <Icon name="close" />
              </Button>
              <DatePickerIOS
                mode="date"
                date={offeredDate.toDate()}
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
                date={effectiveDate.toDate()}
                onDateChange={this._setInitialST}
              />
            </View>
          ) : null}
        </Modal>
      </View>
    );
  }
}

export default withNavigation(withApollo(AddPresenter));
