import { setupRecorder } from 'nock-record';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AudioBayService } from './audiobay.service';
import { TransmissionPoller } from '../transmission/transmission.poller';

describe('Audiobay Service', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let audioBayService: AudioBayService;
  let transmissionPoller = {};
  const record = setupRecorder();

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransmissionPoller)
      .useValue(transmissionPoller)
      .compile();
    app = moduleRef.createNestApplication();
    audioBayService = moduleRef.get<AudioBayService>(AudioBayService);
    await app.init();
  });

  describe('.buildUrl', () => {
    it('Returns correct url when passed term', async () => {
      const res = await audioBayService.buildUrl(`can't hurt me`, null);
      expect(res).toBe(`http://audiobookbay.nl/?s=can't%20hurt%20me`);
    });

    it('Returns correct url when passed term and page', async () => {
      const res = await audioBayService.buildUrl(`can't hurt me`, '3');
      expect(res).toBe(`http://audiobookbay.nl/3?s=can't%20hurt%20me`);
    });
  });

  describe('.buildUrl', () => {
    it('returns results from audiobay', async () => {
      const expectedResponse = [
        {
          title:
            'Can’t Hurt Me: Master Your Mind and Defy the Odds - David Goggins',
          url:
            'http://audiobookbay.nl/audio-books/cant-hurt-me-master-your-mind-and-defy-the-odds-david-goggins-2/',
          image:
            'https://images-na.ssl-images-amazon.com/images/I/8103-4x5J7L.jpg',
          details:
            'Category: Autobiography & Biographies  Bestsellers  Misc. Non-fiction  Language: EnglishKeywords: Biography  Hardship  Memoir  Military  Motivational  ',
        },
        {
          title:
            'Can’t Hurt Me: Master Your Mind and Defy the Odds  - David Goggins',
          url:
            'http://audiobookbay.nl/audio-books/cant-hurt-me-master-your-mind-and-defy-the-odds-david-goggins/',
          image: 'https://images.gr-assets.com/books/1536184191l/41721428.jpg',
          details:
            'Category: Autobiography & Biographies  Misc. Non-fiction  Language: EnglishKeywords: Biography  Non-Fiction  Self-help  ',
        },
        {
          title:
            'Nightfall - CBC Radio - Classic Supernatural Horror - Bill Howell',
          url:
            'http://audiobookbay.nl/audio-books/nightfall-cbc-radio-classic-supernatural-horror-bill-howell/',
          image:
            'http://www.digitaldeliftp.com/DigitalDeliToo/Images/Nightfall-head.png',
          details:
            'Category: Adults  Full Cast  Horror  Paranormal  Language: EnglishKeywords: Drama  Horror  Radio  Supernatural  Suspense  ',
        },
      ];

      const { completeRecording, assertScopesFinished } = await record(
        'query-pass-term',
      );
      const res = await audioBayService.query(`can't hurt me`);
      completeRecording();
      assertScopesFinished();

      expect(expectedResponse.sort()).toEqual(res.sort());
    });
  });
});
