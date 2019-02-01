import React from "react";
import {
  View,
  Title,
  Subtitle,
  Text,
  Button,
  Icon,
  Caption,
  Spinner
} from "@shoutem/ui";
import { Query, Mutation, withApollo } from "react-apollo";
import RatesPresenter from "./RatesPresenter";
import { GET_RATES } from "./RatesQueries";
import {
  GET_QUERYPARAMS,
  SET_QUERYPARAMS
} from "../../../../lib/clientQueries";
import dayjs from "dayjs";
import {
  Modal,
  Platform,
  DatePickerIOS,
  DatePickerAndroid
} from "react-native";

class TitleHeader extends React.Component {
  state = {
    isOpenSF: false,
    isOpenST: false
  };
  _toggleSF = () => {
    this.setState({
      isOpenSF: !this.state.isOpenSF
    });
  };
  _toggleST = () => {
    this.setState({
      isOpenST: !this.state.isOpenST
    });
  };
  render() {
    const { isOpenSF, isOpenST } = this.state;
    return (
      <Query query={GET_QUERYPARAMS}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;
          const { queryParams } = data;
          return (
            <View styleName="horizontal">
              <Button
                styleName="tight md-gutter-right clear"
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
                            date: queryParams.initialSF.toDate()
                          });
                          if (action !== DatePickerAndroid.dismissedAction) {
                            this.props.client
                              .mutate({
                                mutation: SET_QUERYPARAMS,
                                variables: {
                                  queryParams: {
                                    ...queryParams,
                                    initialSF: dayjs(
                                      `${year}-${month + 1}-${day}`
                                    )
                                  }
                                }
                              })
                              .then(res => console.log("done!"));
                          }
                        } catch ({ code, message }) {
                          console.warn("Cannot open date picker", message);
                        }
                      }
                }
              >
                <Caption styleName="sm-gutter-horizontal">
                  {dayjs(queryParams.initialSF).format("MM-DD")}
                </Caption>
              </Button>
              <Title>RATES</Title>
              <Button
                styleName="tight md-gutter-left clear"
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
                            date: queryParams.initialST.toDate()
                          });
                          if (action !== DatePickerAndroid.dismissedAction) {
                            this.props.client
                              .mutate({
                                mutation: SET_QUERYPARAMS,
                                variables: {
                                  queryParams: {
                                    ...queryParams,
                                    initialST: dayjs(
                                      `${year}-${month + 1}-${day}`
                                    )
                                  }
                                }
                              })
                              .then(res => console.log("done!"));
                          }
                        } catch ({ code, message }) {
                          console.warn("Cannot open date picker", message);
                        }
                      }
                }
              >
                <Caption styleName="sm-gutter-horizontal">
                  {dayjs(queryParams.initialST).format("MM-DD")}
                </Caption>
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
                    date={queryParams.initialSF.toDate()}
                    onDateChange={newDate =>
                      this.props.client
                        .mutate({
                          mutation: SET_QUERYPARAMS,
                          variables: {
                            queryParams: {
                              ...queryParams,
                              initialSF: dayjs(newDate)
                            }
                          }
                        })
                        .then(res => console.log("done!"))
                    }
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
                    date={queryParams.initialST.toDate()}
                    onDateChange={newDate =>
                      this.props.client
                        .mutate({
                          mutation: SET_QUERYPARAMS,
                          variables: {
                            queryParams: {
                              ...queryParams,
                              initialST: dayjs(newDate)
                            }
                          }
                        })
                        .then(res => console.log("done!"))
                    }
                  />
                </View>
              </Modal>
            </View>
          );
        }}
      </Query>
    );
  }
}

const WithApolloTitleHeader = withApollo(TitleHeader);

class RatesContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Button styleName="clear" onPress={() => navigation.toggleDrawer()}>
          <Icon name="sidebar" />
        </Button>
      ),
      headerTitle: <WithApolloTitleHeader />,
      headerRight: (
        <Button styleName="clear" onPress={() => navigation.navigate("Search")}>
          <Icon name="search" />
          <Subtitle style={{ marginLeft: -5, marginRight: 10 }}>검색</Subtitle>
        </Button>
      ),
      headerStyle: {
        backgroundColor: "#6dbad8"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  render() {
    return (
      <Query query={GET_QUERYPARAMS}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <View>
                <Spinner />
              </View>
            );
          if (error)
            return (
              <View>
                <Text>Error :(</Text>
              </View>
            );

          const queryParams = data.queryParams;

          return (
            <Query
              query={GET_RATES}
              variables={{
                first: 20,
                queryParams: JSON.stringify(queryParams),
                after: null
              }}
            >
              {({ loading, error, data, fetchMore }) => {
                if (loading)
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Spinner />
                    </View>
                  );
                if (error) return <Text>Error :(</Text>;

                if (data && data.getRates.ok) {
                  const rates = data.getRates.data;

                  return <RatesPresenter rates={rates} fetchMore={fetchMore} />;
                } else {
                  return <Text>Error :(</Text>;
                }
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(RatesContainer);
