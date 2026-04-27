import { Col } from 'react-bootstrap'

import SectionsResultsSkeleton from '../_components/SectionsResultsSkeleton'

export default function CategoryListingLoading() {
  return (
    <Col md={8} lg={8} className="vstack gap-3">
      <SectionsResultsSkeleton count={5} />
    </Col>
  )
}
