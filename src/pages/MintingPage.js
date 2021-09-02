import React from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ImageUploader from "react-images-upload";
import { NFTStorage, File } from "nft.storage";
import { NFT_STORAGE_API_KEY } from "../config";

/**
 * 1. react-images-upload를 통해 image업로드를 받는다.
 * 2. 해당 image파일을 state로 set하고,
 * 3. file이름과 file 설명도 함께 저장하도록 한다.
 * 4. 버튼 클릭시 nft.storage(ipfs)에 저장하도록한다.
 *
 * 5. 저장이 끝나면 해당 token의 id를 받아서 NFT contract에 저장한다(createToken).
 * 6. TX발생이 완료되면, MyToken페이지로 이동시킨다.
 */

const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

export default function MintingPage(props) {
  // 1. react-images-upload를 통해 image업로드를 받는다.
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const onMint = React.useCallback(() => {
    client
      .store({
        name: title,
        description: description,
        image: new File(uploadedImage, uploadedImage[0].name, {
          type: uploadedImage[0].type,
        }),
      })
      .then((token) => {
        console.log(token);
      });
  }, [title, description, uploadedImage]);

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h1>Mint an Item</h1>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Form.Group className="my-1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="설명을 입력해주세요."
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <ImageUploader
            imgExtension={[".jpg", ".png", ".gif", ".jpeg"]}
            maxFileSize={20 * 1024 * 1024}
            withPreview={true}
            label="Max file size: 20mb, accepted: [jpg/jpeg, png, gif]"
            singleImage={true}
            onChange={(file) => {
              setUploadedImage(file);
            }}
          />
        </Col>

        <Col xs={12}>
          <Button
            className="my-4"
            onClick={(e) => {
              e.preventDefault();
              onMint();
            }}
          >
            Mint
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
