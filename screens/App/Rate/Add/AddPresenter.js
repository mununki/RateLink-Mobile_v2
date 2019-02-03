import React from "react";
import {
  DatePickerAndroid,
  Modal,
  DatePickerIOS,
  Platform,
  Keyboard
} from "react-native";
import {
  View,
  Text,
  Button,
  Subtitle,
  Icon,
  TextInput,
  Caption,
  Spinner
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
import {
  AutoComplete,
  AsyncComplete
} from "../../../../components/AutoComplete";
import { NavigationEvents } from "react-navigation";
import checkMutationValidity from "../../../../utils/checkMutationValidity";
import { ToastAndroid } from "react-native";

class AddPresenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isKeyboardShow: false,
      isOpenSF: false,
      isOpenST: false,
      isSaving: false,
      options: {
        inputpersons: [],
        clients: [],
        liners: [],
        pols: [],
        pods: [],
        types: []
      },
      newRate: {
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

  componentDidMount() {
    this._loadMe();
    this._loadClients("");
    this._loadLiners("");
    this._loadCNTRTypes("");
    if (this.props.rate) {
      this._loadPrevRate();
    }
  }

  _loadPrevRate = () => {
    const { rate } = this.props;
    this.setState(prevState => {
      return {
        ...prevState,
        newRate: {
          selectedCt: [{ value: rate.client.id, label: rate.client.name }],
          selectedLn: [{ value: rate.liner.id, label: rate.liner.label }],
          selectedPl: [{ value: rate.pol.id, label: rate.pol.name }],
          selectedPd: [{ value: rate.pod.id, label: rate.pod.name }],
          selectedTy: [{ value: rate.cntrtype.id, label: rate.cntrtype.name }],
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
              variables: { search: search, showOurs: false }
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
                variables: { search: search, showOurs: false, polOrPod: "pol" }
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
                variables: { search: search, showOurs: false, polOrPod: "pod" }
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
              variables: { search: search, showOurs: false }
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
    if (!checkMutationValidity(newRate)) {
      ToastAndroid.show("필수 정보를 입력해주세요.", ToastAndroid.SHORT);
      return false;
    }
    this.setState({ isSaving: true });
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
      .then(() => {
        this.setState({ isSaving: false });
        if (Platform.OS === "ios") {
        } else {
          ToastAndroid.show("입력 완료!", ToastAndroid.SHORT);
        }
        this.props.navigation.navigate("Rates");
      });
  };

  _handleModify = () => {
    const { rate } = this.props;
    const { newRate } = this.state;
    if (!checkMutationValidity(newRate)) {
      ToastAndroid.show("필수 정보를 입력해주세요.", ToastAndroid.SHORT);
      return false;
    }
    this.setState({ isSaving: true });
    this.props.client
      .mutate({
        mutation: SET_RATE,
        variables: {
          newRate: JSON.stringify(newRate),
          handler: "modify",
          rateId: rate.id
        }
      })
      .then(() => {
        this.setState({ isSaving: false });
        if (Platform.OS === "ios") {
        } else {
          ToastAndroid.show("수정 완료!", ToastAndroid.SHORT);
        }
        this.props.navigation.navigate("Rates");
      });
  };

  _setSelected = (select, target) => {
    this.setState(prevState => {
      return {
        ...prevState,
        newRate: {
          ...prevState.newRate,
          [target]: select ? [select] : []
        }
      };
    });
  };

  _keyboardDidShow = () => {
    this.setState({ isKeyboardShow: true });
  };

  _keyboardDidHide = () => {
    this.setState({ isKeyboardShow: false });
  };

  render() {
    const { rate } = this.props;
    const {
      isKeyboardShow,
      isOpenSF,
      isOpenST,
      isSaving,
      options: { clients, liners, types },
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
        <NavigationEvents
          onDidFocus={() => {
            this.keyboardDidShowListener = Keyboard.addListener(
              "keyboardDidShow",
              this._keyboardDidShow
            );
            this.keyboardDidHideListener = Keyboard.addListener(
              "keyboardDidHide",
              this._keyboardDidHide
            );
          }}
          onWillBlur={() => {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
          }}
        />
        <View styleName="sm-gutter">
          <View
            style={isKeyboardShow ? { height: 0, overflow: "hidden" } : null}
          >
            <View styleName="horizontal space-between">
              <View styleName="flexible">
                <Subtitle>업체명</Subtitle>
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
          </View>

          {!isKeyboardShow ? null : (
            <View styleName="horizontal space-between wrap md-gutter-vertical">
              {selectedCt[0] ? (
                <View styleName="horizontal">
                  <Icon name="checkbox-on" style={{ color: "#27ae60" }} />
                  <Text>{selectedCt[0].label}</Text>
                </View>
              ) : (
                <View styleName="horizontal">
                  <Icon name="clear-text" style={{ color: "#c0392b" }} />
                  <Text>업체명</Text>
                </View>
              )}
              {selectedTy[0] ? (
                <View styleName="horizontal">
                  <Icon name="checkbox-on" style={{ color: "#27ae60" }} />
                  <Text>{selectedTy[0].label}</Text>
                </View>
              ) : (
                <View styleName="horizontal">
                  <Icon name="clear-text" style={{ color: "#c0392b" }} />
                  <Text>Type</Text>
                </View>
              )}
              {selectedLn[0] ? (
                <View styleName="horizontal">
                  <Icon name="checkbox-on" style={{ color: "#27ae60" }} />
                  <Text>{selectedLn[0].label}</Text>
                </View>
              ) : (
                <View styleName="horizontal">
                  <Icon name="clear-text" style={{ color: "#c0392b" }} />
                  <Text>선사</Text>
                </View>
              )}
              {selectedPl[0] ? (
                <View styleName="horizontal">
                  <Icon name="checkbox-on" style={{ color: "#27ae60" }} />
                  <Text>{selectedPl[0].label}</Text>
                </View>
              ) : (
                <View styleName="horizontal">
                  <Icon name="clear-text" style={{ color: "#c0392b" }} />
                  <Text>선적지</Text>
                </View>
              )}
              {selectedPd[0] ? (
                <View styleName="horizontal">
                  <Icon name="checkbox-on" style={{ color: "#27ae60" }} />
                  <Text>{selectedPd[0].label}</Text>
                </View>
              ) : (
                <View styleName="horizontal">
                  <Icon name="clear-text" style={{ color: "#c0392b" }} />
                  <Text>도착지</Text>
                </View>
              )}
            </View>
          )}

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
                          date: offeredDate.toDate()
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
              <Text>From {offeredDate.format("MM-DD")}</Text>
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
                          date: effectiveDate.toDate()
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
              <Text>To {effectiveDate.format("MM-DD")}</Text>
            </Button>
          </View>
          <Caption>Buying</Caption>
          <View styleName="horizontal space-between">
            <TextInput
              keyboardType="numeric"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              styleName="flexible"
              placeholder={`20'`}
              value={`${buying20}`}
              onChangeText={text => this._handleChangeText(text, "buying20")}
              style={{ borderWidth: 1, borderColor: "#eee" }}
            />
            <TextInput
              keyboardType="numeric"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              styleName="flexible"
              placeholder={`40'`}
              value={`${buying40}`}
              onChangeText={text => this._handleChangeText(text, "buying40")}
              style={{ borderWidth: 1, borderColor: "#eee" }}
            />
            <TextInput
              keyboardType="numeric"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
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
              keyboardType="numeric"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              styleName="flexible"
              placeholder={`20'`}
              value={`${selling20}`}
              onChangeText={text => this._handleChangeText(text, "selling20")}
              style={{ borderWidth: 1, borderColor: "#eee" }}
            />
            <TextInput
              keyboardType="numeric"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              styleName="flexible"
              placeholder={`40'`}
              value={`${selling40}`}
              onChangeText={text => this._handleChangeText(text, "selling40")}
              style={{ borderWidth: 1, borderColor: "#eee" }}
            />
            <TextInput
              keyboardType="numeric"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
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
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              styleName="flexible"
              placeholder={"REMARK"}
              value={`${remark}`}
              onChangeText={text => this._handleChangeText(text, "remark")}
              style={{ borderWidth: 1, borderColor: "#eee" }}
            />
          </View>
        </View>
        <Button
          styleName="secondary"
          style={{ paddingTop: 5, paddingBottom: 5 }}
          onPress={
            !rate ? () => this._handleSave() : () => this._handleModify()
          }
        >
          {isSaving ? (
            <Spinner styleName="md-gutter-vertical" />
          ) : (
            <Text>SAVE</Text>
          )}
        </Button>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isOpenSF}
          onRequestClose={() => console.log("Modal closed!")}
        >
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
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isOpenST}
          onRequestClose={() => console.log("Modal closed!")}
        >
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
        </Modal>
      </View>
    );
  }
}

export default withNavigation(withApollo(AddPresenter));
