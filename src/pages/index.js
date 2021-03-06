import React, { useRef, useState, useEffect } from 'react'
import useInterval from '@use-it/interval'
import { Vector2 } from 'three'
import { extend, Canvas, useFrame } from 'react-three-fiber'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { OrthographicCamera, OrbitControls, Stats } from 'drei'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

extend({ Line2, LineGeometry, LineMaterial })

const resolution = new Vector2(512, 512)

const initialPoints = [[1, 1, 1]]

const getLast = arr => arr[arr.length - 1]
const getRandomBetween = (min, max) => Math.random() * (max - min) + min
const getRandomIntBetween = (...args) => Math.round(getRandomBetween(...args))
const chance = (p = 0.5) => Math.random() < p

const applyDiretionAndOrientation = (point, direction, orientation) =>
  point.map((x, i) => (i === direction ? x + orientation : x))

const isPointsEqual = point1 => point2 => {
  const [x1,y1,z1] = point1
  const [x2,y2,z2] = point2
  return x1 === x2 && y1 === y2 && z1 === z2
}

const getNextPoint = points => {
  const lastPoint = getLast(points)
  const direction = getRandomIntBetween(0, 2)
  const orientation = chance() ? -1 : 1
  const newPoint = applyDiretionAndOrientation(
    lastPoint,
    direction,
    orientation
  )
  const willCollide = isPointsEqual(newPoint)
  if (points.some(willCollide)) return getNextPoint(points)
  return newPoint
}

const updatePoints = points => [...points, getNextPoint(points)]

const Inner = () => {
  const [points, setPoints] = useState(initialPoints)
  const geomRef = useRef(null)
  const lineRef = useRef(null)

  const loop = () => {
    setPoints(points => [...points, getNextPoint(points)])
    geomRef.current && geomRef.current.setPositions(points.flat())
    lineRef.current && lineRef.current.computeLineDistances()
  }

  useFrame(loop)
  useEffect(loop, [])

  return (
    <line2 ref={lineRef} key={points.length}>
      <lineGeometry attach='geometry' ref={geomRef} linewidth={2} />
      <lineMaterial attach='material' color='lime' resolution={resolution} />
    </line2>
  )
}

const Home = () => (
  <Layout>
    <SEO title='Home' />
    <Canvas>
      <OrthographicCamera>
        <Inner />
      </OrthographicCamera>
      <OrbitControls />
      <Stats />
    </Canvas>
  </Layout>
)

export default Home
