import React, { useState } from "react";
import type { DatePickerProps } from 'antd';
import { Form, Input, Button, DatePicker } from "antd";
import dayjs from "dayjs";

const dateFormat = 'YYYY-MM-DD';
type formProps = {
  title: dayjs.Dayjs,
  content: string,
}
export default function NewsTextarea() {
  const [form] = Form.useForm();
  const onFinish = (values: formProps) => {
    console.log(values.title.format(dateFormat))
  }
  return (
    <Form name="news" layout="vertical" initialValues={{ title: dayjs() }} onFinish={onFinish} style={{width: '800px'}}>
      <Form.Item name="title" label="日期">
        <DatePicker format={dateFormat} />
      </Form.Item>
      <Form.Item name="content" label="内容">
        <Input.TextArea rows={20} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
