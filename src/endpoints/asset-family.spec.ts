import axios from 'axios';

import mockResponse from '../../mocks/asset-family';

import {
  getOne,
  get,
  getAll,
  getAssets,
  getAsset,
  getAssetsAll,
} from './asset-family';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Asset Family', () => {
  test('get', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockResponse.get }),
      );

    const { items } = await get(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/asset-families', {
      params: {},
    });
    expect(items).toHaveLength(1);
  });

  test('getOne', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockResponse.getOne }),
      );

    const assetFamily = await getOne(axios, { code: 'test' });
    expect(axios.get).toBeCalledWith('/api/rest/v1/asset-families/test', {});
    expect(assetFamily).toHaveProperty('code');
  });

  test('getAll', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: mockResponse.getAll }),
      );

    const { items: assetFamilies } = await getAll(axios, {});
    expect(axios.get).toBeCalledWith('/api/rest/v1/asset-families', {
      params: {
        limit: 100,
        page: 1,
        with_count: true,
      },
    });
    expect(assetFamilies).toHaveLength(1);
  });

  test('getAssets', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: { _embedded: {} } }),
      );

    await getAssets(axios, { assetFamilyCode: 'test' });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/asset-families/test/assets',
      {},
    );
  });

  test('getAssetsAll', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementationOnce(async () =>
        Promise.resolve({ data: mockResponse.getAssetsAll[0] }),
      );
    jest
      .spyOn(axios, 'get')
      .mockImplementationOnce(async () =>
        Promise.resolve({ data: mockResponse.getAssetsAll[1] }),
      );

    await getAssetsAll(axios, { assetFamilyCode: 'test' });
    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      '/api/rest/v1/asset-families/test/assets',
      { params: { limit: 100 } },
    );
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      '/api/rest/v1/asset-families/test/assets',
      {
        params: { limit: 100, search_after: 'ALR195T' },
      },
    );
  });

  test('getAsset', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(async () =>
        Promise.resolve({ data: { _embedded: {} } }),
      );

    await getAsset(axios, { assetFamilyCode: 'test', code: 'assetcode' });
    expect(axios.get).toBeCalledWith(
      '/api/rest/v1/asset-families/test/assets/assetcode',
      {},
    );
  });
});
