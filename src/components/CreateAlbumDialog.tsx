import { StyleSheet, View, Text } from "react-native";
// import Dialog from "react-native-dialog";
import { useState } from "react";

interface CreateAlbumDialogProps {
  createAlbum: (name: string) => void;
  onCancel: () => void;
  visible: boolean;
}

const CreateAlbumDialog: React.FC<CreateAlbumDialogProps> = ({
  createAlbum,
  onCancel,
  visible,
}) => {
  const [albumName, setAlbumName] = useState("");
  return (
    <View>
      {/*<Dialog.Container visible={visible}>*/}
      {/*  <Dialog.Title>Neues Album erstellen</Dialog.Title>*/}
      {/*  <Dialog.Input*/}
      {/*    onChangeText={setAlbumName}*/}
      {/*    value={albumName}*/}
      {/*    placeholder={"Albumname"}*/}
      {/*  ></Dialog.Input>*/}
      {/*  <Dialog.Button onPress={onCancel} label="Abbrechen" />*/}
      {/*  <Dialog.Button*/}
      {/*    onPress={() => createAlbum(albumName)}*/}
      {/*    label="Erstellen"*/}
      {/*  />*/}
      {/*</Dialog.Container>*/}
    </View>
  );
};

const styles = StyleSheet.create({});

export default CreateAlbumDialog;
