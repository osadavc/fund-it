import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Input,
  Text,
  InputGroup,
  InputLeftAddon,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useStore from "store";
import { useFileUpload } from "use-file-upload";

interface NewProjectDrawer {
  isOpen: boolean;
  onClose: () => void;
}

const NewProjectDrawer: FC<NewProjectDrawer> = ({ isOpen, onClose }) => {
  const btnRef = useRef();
  const { data: session } = useSession();
  const [file, selectFile] = useFileUpload();
  const replaceUser = useStore((state) => state.replaceUser);
  const user = useStore((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const toast = useToast();

  const form = useForm({
    defaultValues: {
      title: "",
      beneficiaryName: session?.user?.name ?? "",
      xrpAmount: "",
      description: "",
      image: "",
    },
  });

  const handleCreateProject = async (d: any) => {
    try {
      setLoading(true);
      const { data: response } = await axios.post("/api/fund-raiser", d);
      replaceUser({
        ...user,
        fundRaisers: [...user?.fundRaisers!, response!],
      });
      onClose();
      toast({
        status: "success",
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef as any}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent className="py-4">
        <DrawerHeader>Create A New Fund Raiser</DrawerHeader>

        <DrawerBody className="mt-3 space-y-6">
          <div>
            <Text mb="8px">Fund Raiser Title</Text>
            <Input
              placeholder="Fund Raiser Title"
              size="lg"
              {...form.register("title")}
            />
          </div>

          <div>
            <Text mb="8px">Beneficiary Name</Text>
            <Input
              placeholder="Beneficiary Name"
              size="lg"
              {...form.register("beneficiaryName")}
            />
          </div>

          <div>
            <Text mb="8px">Expected XRP Amount</Text>
            <InputGroup size="lg">
              <InputLeftAddon>XRP</InputLeftAddon>
              <Input
                placeholder="Expected XRP Amount"
                type="number"
                {...form.register("xrpAmount")}
              />
            </InputGroup>
          </div>

          <div>
            <Text mb="8px">Fund Raiser Description</Text>
            <Textarea
              placeholder="Fund Raiser Description"
              size="lg"
              {...form.register("description")}
            />
          </div>

          <div>
            <Button
              isLoading={uploading}
              loadingText="Uploading"
              onClick={() => {
                selectFile(
                  {
                    accept: "image/*",
                    multiple: false,
                  },
                  async (info) => {
                    setUploading(true);
                    const formData = new FormData();
                    formData.append("file", (info as any).file);
                    // C-spell: disable-next-line
                    formData.append("upload_preset", "kb0blga9");
                    axios.defaults.withCredentials = false;
                    const { data } = await axios.post(
                      "https://api.cloudinary.com/v1_1/osada-cloud/image/upload",
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    axios.defaults.withCredentials = true;
                    setUploading(false);
                    form.setValue("image", data.secure_url);
                  }
                );
              }}
            >
              Upload Image
            </Button>

            {file && (
              <div>
                <img
                  src={(file as any).source}
                  alt="preview"
                  className="mt-5 w-36"
                />
              </div>
            )}

            <p className="mt-4">
              User donated funds will be credited to the verified wallet
              automatically, no fees will be taken
            </p>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={loading}
            loadingText="Loading"
            onClick={form.handleSubmit(handleCreateProject)}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NewProjectDrawer;
