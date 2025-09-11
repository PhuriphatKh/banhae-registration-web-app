import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "./HomePageDetail.css";

function HomePageDetail() {
  return (
    <div className="page-detail p-3">
      <div className="picture-container w-100 justify-content-center d-flex mb-3">
        <Carousel>
          <Carousel.Item>
            <img src="/1.jpg" alt="slide1" className="d-block w-100" />
            <Carousel.Caption className="text-shadow">
              <h3>โรงเรียนบ้านแฮะ</h3>
              <p>ยินดีต้อนรับเข้าสู่เว็บไซต์โรงเรียนบ้านแฮะ</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/2.jpg" alt="slide2" className="d-block w-100" />
            <Carousel.Caption className="text-shadow">
              <h3>โรงเรียนบ้านแฮะ</h3>
              <p>ยินดีต้อนรับเข้าสู่เว็บไซต์โรงเรียนบ้านแฮะ</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="about-container p-3">
        <h2>เกี่ยวกับโรงเรียน</h2>
        <p>โรงเรียนบ้านแฮะ ตั้งอยู่ที่ ต.แม่ลาว อ.เชียงคำ จ.พะเยา 56110</p>
      </div>
    </div>
  );
}

export default HomePageDetail;
