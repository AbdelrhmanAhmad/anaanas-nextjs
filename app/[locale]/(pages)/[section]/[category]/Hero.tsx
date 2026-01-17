'use client'

import { Button, Col, Container, Row } from 'react-bootstrap'
import backgroundImg7 from '@/assets/images/bg/07.jpg'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import DateFormInput from '@/components/form/DateFormInput'
import eventImg1 from '@/assets/images/icon/badge-outline-filled.svg'
import eventImg2 from '@/assets/images/icon/clipboard-outline-filled.svg'
import eventImg3 from '@/assets/images/icon/home-outline-filled.svg'
import eventImg4 from '@/assets/images/icon/clock-outline-filled.svg'
import eventImg5 from '@/assets/images/icon/imac-outline-filled.svg'
import Link from 'next/link'
import Image from 'next/image'
import { useCategoryContext } from '@/context/CategoryContext'

const Hero = () => {

  const category = useCategoryContext()

  const eventCategories = [
    {
      name: 'Arts & Entertainment',
      image: eventImg1,
    },
    {
      name: 'Business & Conferences',
      image: eventImg2,
    },
    {
      name: 'PNY E-Gaming Fest',
      image: eventImg3,
    },
    {
      name: 'Events & Parties',
      image: eventImg4,
    },
    {
      name: 'Sports & Wellness',
      image: eventImg5,
    },
  ]

  return (

    <div>
      <div
        className="pt-5 pb-0 position-relative"
        style={{
          backgroundImage: `url(${backgroundImg7.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}>
        <div className="bg-overlay bg-dark opacity-8" />
        <div className="py-2">
          <Row className="position-relative">
            <Col lg={9} className="mx-auto">
              <div className="text-center">
                <h1 className="text-white">{category.name}</h1>
              </div>
              <div className="mx-auto bg-mode shadow rounded p-4 mt-5">
                <form className="row align-items-end g-4">
                  <Col sm={6} lg={3}>
                    <label className="form-label">Select genre</label>
                    <ChoicesFormInput className="form-select js-choice choice-select-text-none" data-position="bottom" data-search-enabled="false">
                      <option value="category">ومركبات </option>
                      <option value="comedy">ومركبات </option>
                      <option value="dance">ومركبات </option>
                      <option value="family">ومركبات </option>
                      <option value="music">ومركبات </option>
                      <option value="workshop">ومركبات </option>
                    </ChoicesFormInput>
                  </Col>

                  
                  <Col sm={6} lg={3}>
                    <label className="form-label">Date form</label>
                    <DateFormInput className="form-control" placeholder="12/10/2022" options={{ enableTime: false }} />
                  </Col>
                  <Col sm={6} lg={3}>
                    <label className="form-label">Date to</label>
                    <DateFormInput className="form-control" placeholder="14/10/2022" options={{ enableTime: false }} />
                  </Col>
                  <Col sm={6} lg={3}>
                    <Button variant="primary" className="w-100">
                      Filters Dates
                    </Button>
                  </Col>
                </form>
              </div>
            </Col>
          </Row>





        </div>




      </div>

      <div className="mb-n5 mt-3 mt-lg-5">
        <Col xl={9} lg={11} className="mx-auto">
          <div className="d-md-flex gap-3 mt-5">
            {eventCategories.map((category, idx) => (
              <Link href="/events" className="card card-body mb-3 mb-lg-0 p-3 text-center" key={idx}>
                <Image className="h-40px mb-3 mx-auto" src={category.image} alt="image" />
                <h6>{category.name}</h6>
              </Link>
            ))}
          </div>
        </Col>
      </div>

    </div>
  )
}
export default Hero
