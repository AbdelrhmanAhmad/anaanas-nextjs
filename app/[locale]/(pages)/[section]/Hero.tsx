'use client'

import { Button, Col, Container, Row } from 'react-bootstrap'
import backgroundImg7 from '@/assets/images/bg/07.jpg'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'
import DateFormInput from '@/components/form/DateFormInput'
import Link from 'next/link'
import Image from 'next/image'
import { useSectionContext } from '@/context/SectionContext'

const Hero = () => {
  const { section, categories } = useSectionContext()

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
                <h1 className="text-white">{section.name}  </h1>
              </div>
             
            </Col>
          </Row>





        </div>




      </div>

      <div className="mb-3">
        <Row className="position-relative">
          <Col xl={12} lg={11} className="mx-auto">
            <div
              className="d-flex gap-3 mt-4 pb-2 flex-nowrap"
              style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
            >
              {categories.map((category) => (
                <Link
                  href={section.slug + '/' + category.slug}
                  key={category.id}
                  className="card card-body mb-0 p-3 text-center flex-shrink-0"
                  style={{ minWidth: 150, maxWidth: 180 }}
                >
                  {category.icon && (
                    <Image
                      className="h-40px mb-3 mx-auto"
                      src={category.icon}
                      alt={category.name}
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                  <h6 className="mb-0">{category.name}</h6>
                </Link>
              ))}
            </div>
          </Col>
        </Row>
      </div>

    </div>
  )
}
export default Hero
