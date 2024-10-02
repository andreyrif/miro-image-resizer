miro.onReady(() => {
  const resizeSmallBtn = document.getElementById('resizeSmall');
  const resizeLargeBtn = document.getElementById('resizeLarge');

  resizeSmallBtn.onclick = async () => {
    await resizeImages('small');
  };

  resizeLargeBtn.onclick = async () => {
    await resizeImages('large');
  };
});

async function resizeImages(mode) {
  try {
    // Получить все виджеты на доске
    const widgets = await miro.board.widgets.get();

    // Фильтровать только изображения
    const images = widgets.filter(widget => widget.type === 'image');

    if (images.length < 2) {
      alert('Пожалуйста, добавьте как минимум два изображения на доску.');
      return;
    }

    // Выбрать первые два изображения
    const [img1, img2] = images.slice(0, 2);

    // Получить текущие ширины
    const width1 = img1.width;
    const width2 = img2.width;

    let newWidth;

    if (mode === 'small') {
      newWidth = Math.min(width1, width2);
    } else if (mode === 'large') {
      newWidth = Math.max(width1, width2);
    } else {
      return;
    }

    // Функция для расчета нового размера, сохраняя пропорции
    const calculateNewSize = (widget, targetWidth) => {
      const scale = targetWidth / widget.width;
      return {
        width: targetWidth,
        height: widget.height * scale
      };
    };

    const newSize1 = calculateNewSize(img1, newWidth);
    const newSize2 = calculateNewSize(img2, newWidth);

    // Обновить размеры изображений
    await miro.board.widgets.update([
      { id: img1.id, width: newSize1.width, height: newSize1.height },
      { id: img2.id, width: newSize2.width, height: newSize2.height }
    ]);

    alert('Размеры изображений обновлены успешно!');
  } catch (error) {
    console.error(error);
    alert('Произошла ошибка при изменении размеров изображений.');
  }
}