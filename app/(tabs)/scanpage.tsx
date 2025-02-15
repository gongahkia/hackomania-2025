import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Platform, ToastAndroid } from 'react-native';
import { router } from 'expo-router';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  // Using a ref for immediate flag update
  const scannedRef = useRef(false);

  const handleBarCodeScanned = ({ type, data, bounds }: { type: string; data: string; bounds?: any }) => {
    // Return early if a scan is already in progress
    if (scannedRef.current) return;

    scannedRef.current = true;
    console.log(`Scanned barcode with type ${type} and data: ${data}`);

    if (Platform.OS === 'android') {
      ToastAndroid.show('QR Code Scanned!', ToastAndroid.SHORT);
    } else {
      alert('QR Code Scanned!');
    }

    // Delay navigation to prevent rapid-fire scans.
    setTimeout(() => {
      scannedRef.current = false; // Reset the flag to allow scanning again if needed
      router.replace('/explore');
    }, 1500); // Adjust the delay as necessary
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarCodeScanned}
        // Uncomment the line below to limit scanning to QR codes only:
        // barcodeScannerSettings={{ barCodeTypes: [CameraView.Constants.BarCodeType.qr] }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
