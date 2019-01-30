import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";
import { Text, Icon, Caption, Overlay, Button, View } from "@shoutem/ui";
import PropTypes from "prop-types";
import { getAWSS3Url } from "../env.config";
import styled from "styled-components/native";
import dayjs from "dayjs";
import { withNavigation } from "react-navigation";

const AWS_S3_ENDPOINT = getAWSS3Url();

const RateCardContainer = styled.View`
  flex: 1;
  padding: 10px;
  margin: 7px 0 0 0;
  border: 1px solid #eee;
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
  render() {
    const {
      rate,
      currentlyOverlayed,
      currentlyOverlayedResolveMethod,
      _updateParentState
    } = this.props;
    const { isOverlayed } = this.state;
    return (
      <TouchableWithoutFeedback
        ref={node => (this.rateCard = node)}
        onPress={() => {
          if (currentlyOverlayed !== this.rateCard) {
            currentlyOverlayedResolveMethod(false);
          }
        }}
        onLongPress={() => {
          if (currentlyOverlayed) {
            currentlyOverlayedResolveMethod(false);
          }
          _updateParentState({
            currentlyOverlayed: this.rateCard,
            currentlyOverlayedResolveMethod: this._toggleOverlay
          });
          this._toggleOverlay(true);
        }}
      >
        <RateCardContainer>
          <AvatarRow>
            <Avatar>
              <Image
                source={
                  rate.inputperson.profile.image
                    ? {
                        uri: `${AWS_S3_ENDPOINT}${
                          rate.inputperson.profile.image
                        }`
                      }
                    : require("../assets/profile_images/dummy.png")
                }
                style={{
                  resizeMode: "contain",
                  width: 30,
                  height: 30,
                  marginTop: -15,
                  borderRadius: 15
                }}
              />
              <Text style={{ marginLeft: 5 }}>
                {rate.inputperson.profile.profile_name}
              </Text>
            </Avatar>

            <Validty>
              <Text style={{ fontSize: 12, color: "#aaa", marginRight: 5 }}>
                {dayjs(rate.offeredDate).format("MM-DD")}
              </Text>
              <Text style={{ fontSize: 12, color: "#aaa" }}>
                {dayjs(rate.effectiveDate).format("MM-DD")}
              </Text>
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
                <Button styleName="lg-gutter-horizontal">
                  <Text>복제</Text>
                </Button>
                <Button
                  styleName="lg-gutter-horizontal"
                  onPress={() =>
                    this.props.navigation.navigate("Add", { rate })
                  }
                >
                  <Text>수정</Text>
                </Button>
                <Button styleName="lg-gutter-horizontal">
                  <Text>삭제</Text>
                </Button>
              </View>
            </Overlay>
          ) : null}
        </RateCardContainer>
      </TouchableWithoutFeedback>
    );
  }
}

RateCard.propTypes = {
  data: PropTypes.object
};

export default withNavigation(RateCard);
