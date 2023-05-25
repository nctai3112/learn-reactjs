import React, { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { Button, Modal, Form, Input } from "antd";
import "antd/dist/antd";

const AnnotationApp = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rectangles, setRectangles] = useState([]);

  const handleAddRectangle = (values) => {
    setRectangles([...rectangles, values]);
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>Add Rectangle</Button>
      <Stage width={500} height={500}>
        <Layer>
          {rectangles.map(({ x, y, width, height, fill }) => (
            <Rect
              key={`${x}${y}`}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={fill}
            />
          ))}
        </Layer>
      </Stage>
      <Modal
        title="Add Rectangle"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddRectangle}>
          <Form.Item label="X" name="x">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Y" name="y">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Width" name="width">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Height" name="height">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Fill" name="fill">
            <Input type="color" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AnnotationApp;
