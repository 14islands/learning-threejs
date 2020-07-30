import React, { useRef, useState, useEffect } from 'react'
import useInterval from '@use-it/interval'
import { Vector2 } from 'three'
import { extend, Canvas, useFrame, useUpdate } from 'react-three-fiber'
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
  point.map((x, i) => i === direction ? x + orientation : x)

const getNextPoint = points => {
  const lastPoint = getLast(points)
  const direction = getRandomIntBetween(0, 2)
  const orientation = chance() ? -1 : 1
  return applyDiretionAndOrientation(lastPoint, direction, orientation)
}

const updatePoints = points => [...points, getNextPoint(points)]

const Inner = ({ points }) => {
  const geomRef = useUpdate(x => x.setPositions(points.flat()), [points])
  const lineRef = useUpdate(x => x.computeLineDistances(), [points])

  useEffect(() => {
    if (!geomRef.current || !lineRef.current) return
    geomRef.current.setPositions(initialPoints.flat())
    lineRef.current.computeLineDistances()
  }, [geomRef, lineRef])
  
  useEffect(() => {
    if (!geomRef.current || !lineRef.current) return
    geomRef.current.setPositions(points.flat())
  }, [geomRef, points])

  return (
    <line2 ref={lineRef} key={points}>
      <lineGeometry attach='geometry' ref={geomRef} linewidth={2} />
      <lineMaterial attach='material' color='lime' resolution={resolution} />
    </line2>
  )
}

const Home = () => {
  const [points, setPoints] = useState(initialPoints)

  useInterval(() => setPoints(updatePoints), 100)
  return (
    <Layout>
      <SEO title='Home' />
      <Canvas>
        <OrthographicCamera>
          <Inner points={points} />
        </OrthographicCamera>
        <OrbitControls />
        <Stats />
      </Canvas>
    </Layout>
  )
}

export default Home
