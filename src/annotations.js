import React from 'react'
import styled from 'styled-components'
import { uniqueId } from 'lodash'

import Marker from './marker'
import Annotation from './annotation'

import Tooltip from './tooltip'

const ID_PREFIX = 'annotation_'

// TODO: implement Tooltip out of bounds check:
// if body.width < (tooltipwidth + padding + tooltip.x)
// if body.height < (tooltipheight + padding + tooltip.y)

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: palegreen;

  /* Using this so */
  position: relative;
`

const DeleteButton = styled.button`
  cursor: pointer;
  border: 0;
  background: red;
  color: #fff;
  font-weight: bold;
`

// Add tests for:
// Container click click (a marker should be created)
// hover over created marker (should show tooltip)
// Delete annotation

const createNewAnnotation = ({ x, y, id }) => ({
  x,
  y,
  isOpen: true,
  id,
  content: 'Some string',
})

class Annotations extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      annotationStore: {},
    }

    this.handleSelection = this.handleSelection.bind(this)
  }

  handleSelection(ev) {
    const { pageX: x, pageY: y } = ev

    const id = uniqueId(ID_PREFIX)

    this.setState({
      annotationStore: {
        ...this.state.annotationStore,
        [id]: createNewAnnotation({ x, y, id }),
      },
    })
  }

  handleAnnotationHoverEnter(id) {
    const annotation = { ...this.state.annotationStore[id] }

    // No need to update the state if the annotation's tooltip tooltip is already open
    if (annotation.isOpen === true) return

    annotation.isOpen = true

    this.setState({
      annotationStore: {
        ...this.state.annotationStore,
        [id]: annotation,
      },
    })
  }

  handleAnnotationHoverExit(id) {
    const annotation = {
      ...this.state.annotationStore[id],
    }

    // No need to update the state if the annotation's tooltip is already closed
    if (annotation.isOpen === false) return

    annotation.isOpen = false

    this.setState({
      annotationStore: {
        ...this.state.annotationStore,
        [id]: annotation,
      },
    })
  }

  handleDeleteAnnotation(ev, id) {
    ev.stopPropagation()
    const annotationStore = { ...this.state.annotationStore }

    // Delete the annotation by ID
    delete annotationStore[id]

    this.setState({
      annotationStore,
    })
  }

  render() {
    const { annotationStore } = this.state

    return (
      <Container onClick={this.handleSelection}>
        {Object.values(annotationStore).map(({ x, y, isOpen, id, content }) => (
          <Annotation
            key={`marker-${id}`}
            x={x}
            y={y}
            annotationId={id}
            onMouseEnter={() => this.handleAnnotationHoverEnter(id)}
            onMouseLeave={() => this.handleAnnotationHoverExit(id)}
          >
            <Marker x={x} y={y} />
            {isOpen && (
              <Tooltip x={x} y={y}>
                {content}
                <DeleteButton
                  type='button'
                  onClick={ev => this.handleDeleteAnnotation(ev, id)}
                >
                  delete
                </DeleteButton>
              </Tooltip>
            )}
          </Annotation>
        ))}
      </Container>
    )
  }
}

export default Annotations
