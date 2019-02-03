import React from "react";
import { Modal } from "react-native";
import {
  View,
  Subtitle,
  Text,
  Button,
  Icon,
  TextInput,
  TouchableOpacity,
  Overlay
} from "@shoutem/ui";
import { ScrollView } from "react-native-gesture-handler";

class AutoComplete extends React.Component {
  state = {
    isOpen: false
  };

  _controlModal = visible => {
    this.setState({
      isOpen: visible
    });
  };

  render() {
    const { options, onSelect, selected, loadAsync } = this.props;
    const { isOpen } = this.state;
    return (
      <View>
        <View styleName="horizontal v-center">
          <Button
            style={{ flex: 1, backgroundColor: "#eee" }}
            onPress={() => this._controlModal(true)}
          >
            <Subtitle style={{ marginTop: 10, marginBottom: 10 }}>
              {selected.length > 0 && selected[0]
                ? selected[0].label
                : "선택없음"}
            </Subtitle>
            <Icon name="drop-down" />
          </Button>
          {selected.length > 0 ? (
            <TouchableOpacity
              onPress={() => onSelect()}
              style={{
                position: "absolute",
                right: 0,
                paddingLeft: 10,
                paddingRight: 10
              }}
            >
              <Icon name="close" style={{ color: "#ccc" }} />
            </TouchableOpacity>
          ) : null}
        </View>
        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={false}
          onRequestClose={() => this.setState({ isOpen: false })}
        >
          <View
            style={{
              flex: 1,
              padding: 15,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.2)"
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#eee",
                width: "100%",
                borderRadius: 10
              }}
            >
              <View
                styleName="horizontal h-end"
                style={{
                  marginTop: 30,
                  marginRight: 5
                }}
              >
                <Text>{options.length}개 찾음</Text>
              </View>
              <TextInput
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={text => loadAsync(text)}
                placeholder="Search"
                style={{
                  marginTop: 5,
                  marginBottom: 20,
                  marginLeft: 10,
                  marginRight: 10
                }}
              />
              <ScrollView>
                {options &&
                  options.map((option, index) => (
                    <Button
                      styleName="clear"
                      key={index}
                      onPress={() => {
                        onSelect(option);
                        this._controlModal(false);
                      }}
                    >
                      <Subtitle styleName="md-gutter-vertical">
                        {option.label}
                      </Subtitle>
                    </Button>
                  ))}
              </ScrollView>
              <Button
                styleName="clear"
                onPress={() => this._controlModal(false)}
                style={{ paddingTop: 20, paddingBottom: 20 }}
              >
                <Icon name="close" />
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default AutoComplete;
