
  await prisma.mediaItem.create({
    data: {
      title,
      description: description || null,
      category,
      type,
      date: new Date(date),
      fileUrl: fileUrl || null,
      thumbnail: thumbnail || null,
      brandId: brand.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
  revalidatePath("/video");
  revalidatePath("/foto");
  revalidatePath("/grafica");
  revalidatePath("/audio");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath(`/brand/${brand.slug}`);

  return NextResponse.json({
    ok: true,
    message: "Fișier creat.",
  });
}@dragoshelemenet ➜ /workspaces/wsod (main) $ 