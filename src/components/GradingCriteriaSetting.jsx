// SettingsModal.jsx
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function SettingsModal({ show, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    grade1_0: 50,
    grade1_5: 55,
    grade2_0: 60,
    grade2_5: 65,
    grade3_0: 70,
    grade3_5: 75,
    grade4_0: 80,
  });
  const [loading, setLoading] = useState(false);

  // อัปเดตฟอร์มเมื่อเปิด modal หรือเมื่อ initial เปลี่ยน
  useEffect(() => {
    if (!show) return;
    setForm({
      grade1_0: Number(initial?.grade1_0 ?? 50),
      grade1_5: Number(initial?.grade1_5 ?? 55),
      grade2_0: Number(initial?.grade2_0 ?? 60),
      grade2_5: Number(initial?.grade2_5 ?? 65),
      grade3_0: Number(initial?.grade3_0 ?? 70),
      grade3_5: Number(initial?.grade3_5 ?? 75),
      grade4_0: Number(initial?.grade4_0 ?? 80),
    });
  }, [show, initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value === "" ? "" : Number(value) }));
  };

  const handleSubmit = () => {
    onSave?.(form); // ส่งค่ากลับไป parent เพื่อเซฟต่อ
    onClose?.();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>ตั้งค่าเกณฑ์การตัดเกรด</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col md={4}>
            <Form.Label>เกรด 1.0 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade1_0"
              value={form.grade1_0}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>เกรด 1.5 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade1_5"
              value={form.grade1_5}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>เกรด 2.0 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade2_0"
              value={form.grade2_0}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>เกรด 2.5 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade2_5"
              value={form.grade2_5}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>เกรด 3.0 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade3_0"
              value={form.grade3_0}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>เกรด 3.5 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade3_5"
              value={form.grade3_5}
              onChange={handleChange}
            />
          </Col>

          <Col md={4}>
            <Form.Label>เกรด 4.0 ขึ้นไป</Form.Label>
            <Form.Control
              type="number"
              min={0}
              name="grade4_0"
              value={form.grade4_0}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button className="cancel-butt" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button className="save-butt" onClick={handleSubmit}>
          บันทึก
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
