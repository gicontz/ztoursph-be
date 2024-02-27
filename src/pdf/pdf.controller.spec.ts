import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

describe('PdfController', () => {
  let controller: PdfController;
  let pdfService: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PdfService], // Include the PdfService as a provider
    }).compile();

    controller = module.get<PdfController>(PdfController);
    pdfService = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDummyData', () => {
    it('should return a generated PDF', async () => {
      // Arrange
      const mockTitle = 'hello world';
      const mockGeneratedPdf = 'mockGeneratedPdfContent';

      jest.spyOn(pdfService, 'GeneratePDF').mockResolvedValue(mockGeneratedPdf);

      // Act
      const result = await controller.getDummyData({ title: mockTitle });

      // Assert
      expect(result).toEqual(mockGeneratedPdf);
      expect(pdfService.GeneratePDF).toHaveBeenCalledWith(mockTitle);
    });
  });
});
