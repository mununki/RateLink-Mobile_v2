import React from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  TextInput,
  Spinner,
  Button,
  TouchableOpacity
} from "@shoutem/ui";
import { AutoComplete } from "../../../components/AutoComplete";
import { withApollo } from "react-apollo";
import { getAWSS3Url } from "../../../env.config";
import { UPDATE_PROFILE, UPDATE_PROFILE_IMAGE } from "./ProfileQueries";
import Toast from "react-native-simple-toast";
import Friends from "../../../components/Friends";
import { ImagePicker } from "expo";
import { ReactNativeFile } from "apollo-upload-client";

const AWS_S3_ENDPOINT = getAWSS3Url();

const jobOptions = [
  { value: "0", label: "선택없음" },
  { value: "1", label: "선사" },
  { value: "2", label: "포워더" },
  { value: "3", label: "기타" }
];

const convertJobBoolean = job_boolean => {
  return jobOptions.filter(option => option.value === job_boolean);
};

class ProfilePresenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_name: this.props.me.data.profile.profile_name,
      company: this.props.me.data.profile.company,
      job_boolean: this.props.me.data.profile.job_boolean
        ? this.props.me.data.profile.job_boolean
        : "0",
      isSaving: false
    };
  }

  _handleChangeText = (text, target) => this.setState({ [target]: text });

  _handleSave = () => {
    this.setState({ isSaving: true });
    const { profile_name, company, job_boolean } = this.state;
    this.props.client
      .mutate({
        mutation: UPDATE_PROFILE,
        variables: {
          profile_name,
          company,
          job_boolean
        }
      })
      .then(res => {
        if (res.data.updateProfile.ok) {
          Toast.show("저장 완료!", Toast.SHORT);
        } else {
          Toast.show("다시 시도해주세요", Toast.SHORT);
        }
        this.setState({ isSaving: false });
      })
      .catch(error => {
        console.warn(error);
        this.setState({ isSaving: false });
      });
  };

  _handleUpdateAvatar = file => {
    this.props.client
      .mutate({
        mutation: UPDATE_PROFILE_IMAGE,
        variables: { file }
      })
      .then(res => {
        if (res.data.updateProfileImage.ok) {
          Toast.show("저장 성공", Toast.SHORT);
        } else {
          Toast.show("다시 시도해주세요", Toast.SHORT);
        }
      })
      .catch(error => {
        Toast.show("다시 시도해주세요", Toast.SHORT);
      });
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1]
    });

    if (!result.cancelled) {
      const file = new ReactNativeFile({
        uri: result.uri,
        name: "avatar.jpg",
        type: "image/jpeg"
      });
      this._handleUpdateAvatar(file);
    }
  };

  render() {
    const { me } = this.props;
    const { profile_name, company, job_boolean, isSaving, image } = this.state;
    return (
      <View styleName="flexible vertical">
        <View styleName="horizontal v-center">
          <View
            styleName="vertical v-center h-center"
            style={{ width: 150, backgroundColor: "#fff" }}
          >
            <TouchableOpacity onPress={() => this._pickImage()}>
              <Image
                source={
                  me.data.profile.image
                    ? {
                        uri: `${AWS_S3_ENDPOINT}${me.data.profile.image}`
                      }
                    : require("../../../assets/profile_images/dummy.png")
                }
                style={{
                  width: 80,
                  height: 80,
                  borderWidth: 1,
                  borderColor: "#fff",
                  borderRadius: 40
                }}
              />
            </TouchableOpacity>
          </View>
          <View styleName="flexible sm-gutter">
            <TextInput
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={`별명`}
              value={`${profile_name}`}
              onChangeText={text =>
                this._handleChangeText(text, "profile_name")
              }
              style={{ backgroundColor: "#eee", margin: 1 }}
            />
            <TextInput
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={`회사이름`}
              value={`${company}`}
              onChangeText={text => this._handleChangeText(text, "company")}
              style={{ backgroundColor: "#eee", margin: 1 }}
            />
            <AutoComplete
              isSearchable={false}
              options={jobOptions}
              selected={convertJobBoolean(job_boolean)}
              onSelect={option => {
                if (option) {
                  this.setState({ job_boolean: option.value });
                } else {
                  this.setState({ job_boolean: "0" });
                }
              }}
            />
            <Button
              styleName="secondary"
              onPress={() => this._handleSave()}
              style={{ marginTop: 2 }}
            >
              {isSaving ? (
                <Spinner style={{ marginTop: 10, marginBottom: 10 }} />
              ) : (
                <Text>SAVE</Text>
              )}
            </Button>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Friends />
        </View>
      </View>
    );
  }
}

export default withApollo(ProfilePresenter);
