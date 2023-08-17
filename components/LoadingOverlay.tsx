import { Flex, Spinner, Stack } from "@sanity/ui";

export default function LoadingOverlay() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <Flex direction={"column"} align={"center"} gap={3}>
        Loading
        <Spinner muted />
      </Flex>
    </div>
  );
}
