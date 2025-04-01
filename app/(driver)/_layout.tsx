import { Stack } from "expo-router";

const DriverLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="Map" />
            <Stack.Screen name="StudentList" />
            <Stack.Screen name="chat" />
        </Stack>
    );
};

export default DriverLayout;