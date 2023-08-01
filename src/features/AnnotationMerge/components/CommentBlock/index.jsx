import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { CommentOutlined } from '@ant-design/icons';
import { googleLoginSelector } from "../../../../redux/selectors";
import { useSelector } from "react-redux";
import "./styles.css"

function CommentBlock(props) {
    const googleLoginData = useSelector(googleLoginSelector);
    const loginEmail = googleLoginData.email;
    const { annotationId, commentHeight } = props;

    const onFinish = async (values) => {
        const response = await fetch("http://localhost:5000/projects/comment", {
            method: "POST",
            headers: {
            Accept: "*/*",
            Connection: "keep-alive",
            "Content-Type": "application/json",
            "user-agent": "Chrome",
            },
            body: JSON.stringify({
                annotationId: annotationId,
                commentor: loginEmail,
                comment: values.comment
            })
        });
        if (response.ok) {
            updateCommentList();
        }
    };

    const [commentList, setCommentList] = useState([]);
    const updateCommentList = async () => {
        const responseGetComment = await fetch("http://localhost:5000/projects/get-comment", {
            method: "POST",
            headers: {
            Accept: "*/*",
            Connection: "keep-alive",
            "Content-Type": "application/json",
            "user-agent": "Chrome",
            },
            body: JSON.stringify({
                annotationId: annotationId,
            })
        });
        if (responseGetComment.ok) {
            const responseData = await responseGetComment.json();
            setCommentList(responseData.data);
        }
    }

    useEffect(() => {
      updateCommentList();
    }, []);

    return (
      <div className="comment-block" style={{ height: `${commentHeight}px` }}>
        <div className="comment-list">
          {commentList && Array.isArray(commentList) && commentList.length > 0
            ? commentList.map((commentItem) => {
                return (
                  <div className="comment-item">{commentItem.comment}</div>
                );
              })
            : ""}
        </div>
        <Form onFinish={onFinish} className="comment-input">
          <Form.Item name="comment">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                placeholder="Input your comment..."
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                htmlType="submit"
                icon={<CommentOutlined />}
              />
            </div>
          </Form.Item>
        </Form>
      </div>
    );
}

export default CommentBlock;
