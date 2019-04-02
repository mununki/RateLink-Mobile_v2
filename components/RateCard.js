import React from "react";
import { Image, Alert } from "react-native";
import { Text, Icon, Caption, Overlay, Button, View, TouchableOpacity } from "@shoutem/ui";
import PropTypes from "prop-types";
import { getAWSS3Url } from "../env.config";
import styled from "styled-components/native";
import dayjs from "dayjs";
import { withNavigation } from "react-navigation";
import { withApollo } from "react-apollo";
import { SET_RATE } from "../screens/App/Rate/Add/AddQueries";
import { GET_QUERYPARAMS } from "../lib/clientQueries";
import { GET_RATES } from "../screens/App/Rate/Rates/RatesQueries";
import Toast from "react-native-simple-toast";

const AWS_S3_ENDPOINT = getAWSS3Url();

const RateCardContainer = styled.View`
  padding: 10px;
  margin: 7px 0 0 0;
  background-color: #fff;
  border-radius: 5px;
  height: 170px;
  border-left-width: ${props => (props.isToday ? "5px" : 0)};
  border-left-color: #c0392b;
`;

const AvatarRow = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 0 0 5px 0;
`;

const Validty = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;

const Avatar = styled.View`
  flex: 1;
  flex-direction: row;
`;

const FirstRow = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px 0 5px 0;
`;

const LinerImageConainer = styled.View`
  flex: 1;
`;

const PolPodContainer = styled.View`
  flex: 2;
  flex-direction: row;
`;

const SecondRow = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 0 10px 0;
`;

const Buying = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
`;

const Selling = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
`;

const CommentRow = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 5px 0 5px 0;
  padding-left: 10px;
`;

class RateCard extends React.Component {
  state = {
    isOverlayed: false
  };

  _toggleOverlay = visible => {
    this.setState({
      isOverlayed: visible
    });
  };

  _handleDuplicate = () => {
    const { rate } = this.props;
    this.props.client
      .mutate({
        mutation: SET_RATE,
        variables: {
          rateId: rate.id,
          handler: "duplicate"
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
      });
  };

  _handleDelete = () => {
    const { rate } = this.props;
    this.props.client
      .mutate({
        mutation: SET_RATE,
        variables: {
          rateId: rate.id,
          handler: "delete"
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
        const newRatesInCache = getRates.data.edges.filter(edge => edge.node.id !== res.data.setRate[0].id);
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
                edges: newRatesInCache
              }
            }
          }
        });
      });
  };

  render() {
    const { me, rate, currentlyOverlayed, currentlyOverlayedResolveMethod, _updateParentState } = this.props;
    const { isOverlayed } = this.state;
    return (
      <TouchableOpacity
        ref={node => (this.rateCard = node)}
        onPress={() => {
          // check if this is touched when other rateCards in the parent view are touched
          if (currentlyOverlayed && currentlyOverlayed !== this.rateCard) {
            // if other rateCard is touched, then disable the overlay
            currentlyOverlayedResolveMethod(false);
          }
        }}
        delayLongPress={300}
        onLongPress={() => {
          // check if other card is already overlayted
          if (currentlyOverlayed) {
            // then disable the overlay
            currentlyOverlayedResolveMethod(false);
          }
          // set this rateCard and resolveMethod into parent's state
          _updateParentState({
            currentlyOverlayed: this.rateCard,
            currentlyOverlayedResolveMethod: this._toggleOverlay
          });
          this._toggleOverlay(true);
        }}
      >
        <RateCardContainer
          style={{
            elevation: 3
          }}
          isToday={dayjs(rate.offeredDate).format("MM-DD") === dayjs().format("MM-DD")}
        >
          <AvatarRow>
            <Avatar>
              <Image
                source={
                  rate.inputperson.profile.image
                    ? {
                        uri: `${AWS_S3_ENDPOINT}${rate.inputperson.profile.image}`
                      }
                    : require("../assets/profile_images/dummy.png")
                }
                style={{
                  width: 30,
                  height: 30,
                  marginTop: -15,
                  borderRadius: 15
                }}
              />
              <Caption style={{ marginLeft: 5 }}>{rate.inputperson.profile.profile_name}</Caption>
            </Avatar>
            <Text>{rate.client.name}</Text>

            <Validty>
              <Text style={{ fontSize: 12, color: "#aaa", marginRight: 5 }}>
                {dayjs(rate.offeredDate).format("MM-DD")}
              </Text>
              <Text style={{ fontSize: 12, color: "#aaa" }}>{dayjs(rate.effectiveDate).format("MM-DD")}</Text>
            </Validty>
          </AvatarRow>

          <FirstRow>
            <PolPodContainer>
              <Text>{rate.pol.name}</Text>
              <Icon name="right-arrow" style={{ fontSize: 15 }} />
              <Text>{rate.pod.name}</Text>
            </PolPodContainer>
            <LinerImageConainer>
              <Image
                source={{
                  uri: `${AWS_S3_ENDPOINT}/liners_images/${rate.liner.name}.png`
                }}
                style={{
                  resizeMode: "contain",
                  alignSelf: "flex-start",
                  width: 100,
                  height: 20
                }}
              />
            </LinerImageConainer>
          </FirstRow>

          <SecondRow>
            <Buying>
              <Text>{rate.buying20}</Text>
              <Text>{rate.buying40}</Text>
              <Text>{rate.buying4H}</Text>
            </Buying>
            <Icon name="play" style={{ color: "#eee" }} />
            <Selling>
              <Text>{rate.selling20}</Text>
              <Text>{rate.selling40}</Text>
              <Text>{rate.selling4H}</Text>
            </Selling>
          </SecondRow>

          <CommentRow>
            <Icon
              name="comment"
              style={{
                color: rate.remark ? "#fbbf41" : "#efefef",
                fontSize: 20
              }}
            />
            <Caption style={{ marginLeft: 10 }}>{rate.remark}</Caption>
          </CommentRow>
          {isOverlayed ? (
            <Overlay styleName="fill-parent image-overlay">
              <View styleName="horizontal">
                <Button
                  styleName="lg-gutter-horizontal"
                  onPress={() => {
                    if (me.data.email !== rate.inputperson.email) {
                      Alert.alert(
                        "Confirm",
                        "Please confirm the duplication.",
                        [
                          {
                            text: "Cancel",
                            onPress: () => {},
                            style: "cancel"
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              this._handleDuplicate();
                            }
                          }
                        ],
                        { cancelable: false }
                      );
                    } else {
                      Toast.show(`Already added by ${me.data.profile.profile_name}.`, Toast.SHORT);
                    }
                  }}
                >
                  <Text>Duplicate</Text>
                </Button>
                <Button
                  styleName="lg-gutter-horizontal"
                  onPress={() => {
                    if (me.data.email !== rate.inputperson.email) {
                      Toast.show(`This is not yours`, Toast.SHORT);
                    } else {
                      this.props.navigation.navigate("Add", { rate });
                    }
                  }}
                >
                  <Text>Modify</Text>
                </Button>
                <Button
                  styleName="lg-gutter-horizontal"
                  onPress={() => {
                    if (me.data.email !== rate.inputperson.email) {
                      Toast.show(`This is not yours`, Toast.SHORT);
                    } else {
                      Alert.alert(
                        "Confirm",
                        "Please confirm the delete",
                        [
                          {
                            text: "Cancel",
                            onPress: () => {},
                            style: "cancel"
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              _updateParentState({
                                currentlyOverlayed: null,
                                currentlyOverlayedResolveMethod: null
                              });
                              this._handleDelete();
                            }
                          }
                        ],
                        { cancelable: false }
                      );
                    }
                  }}
                >
                  <Text>Delete</Text>
                </Button>
              </View>
            </Overlay>
          ) : null}
        </RateCardContainer>
      </TouchableOpacity>
    );
  }
}

RateCard.propTypes = {
  data: PropTypes.object
};

export default withNavigation(withApollo(RateCard));
