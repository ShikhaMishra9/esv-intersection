import { CanvasRenderingContext2DEvent } from 'jest-canvas-mock';
import { CalloutCanvasLayer, IntersectionReferenceSystem } from '../src/index';
import { rescaleEventStub } from './test-helpers';

describe('CalloutCanvasLayer', () => {
  let elm: HTMLElement;
  const wp = [
    [30, 40, 4],
    [40, 70, 6],
    [45, 100, 8],
    [50, 110, 10],
  ];

  beforeEach(() => {
    elm = document.createElement('div');
  });
  afterEach(() => {
    elm.remove();
  });
  describe('when setting reference system', () => {
    const data = [
      {
        title: 'Seabed',
        group: 'ref-picks',
        label: '91.1 m RKB',
        color: 'rgba(0,0,0,0.8)',
        md: 91.1,
      },
    ];

    it('should render when reference system is set in constructor', () => {
      // Arrange
      const referenceSystem = new IntersectionReferenceSystem(wp);
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', { referenceSystem });
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(rescaleEventStub(data));

      layer.ctx.__clearEvents();

      // Act
      layer.data = data;

      // Assert
      const events: CanvasRenderingContext2DEvent[] = layer.ctx.__getEvents();
      const fillTextCalls = events.filter((call: any) => call.type === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should render when reference system is set after constructor', () => {
      // Arrange
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', {});
      const referenceSystem = new IntersectionReferenceSystem(wp);
      layer.referenceSystem = referenceSystem;
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(rescaleEventStub(data));

      layer.ctx.__clearEvents();

      // Act
      layer.data = data;

      // Assert
      const events: CanvasRenderingContext2DEvent[] = layer.ctx.__getEvents();
      const fillTextCalls = events.filter((call: any) => call.type === 'fillText');
      expect(fillTextCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should not throw exception when setting data without reference system', () => {
      // Arrange
      const layer = new CalloutCanvasLayer('calloutcanvaslayer', {});
      layer.onMount({ elm });
      layer.onUpdate({});
      layer.onRescale(rescaleEventStub(data));

      layer.ctx.__clearEvents();

      // Act
      // Assert
      expect(() => {
        layer.data = data;
      }).not.toThrow();
    });
  });
});
